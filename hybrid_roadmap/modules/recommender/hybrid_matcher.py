"""
HYBRID JOB MATCHING ENGINE
Combines Semantic & TF-IDF matching with detailed percentage breakdowns
"""

import json
import os
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np


class HybridJobMatcher:
    """
    Combines multiple matching strategies for job recommendations:
    1. Semantic Matching (70%) - understands meaning similarity
    2. TF-IDF Matching (30%) - keyword frequency matching
    """

    def __init__(self):
        # Load pre-trained semantic model
        self.semantic_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        self.tfidf_vectorizer = None

    def load_sample_jobs(self):
        """Load job descriptions from JSON"""
        base_dir = os.path.dirname(__file__)
        json_path = os.path.join(base_dir, "sample_jds.json")
        
        if not os.path.exists(json_path):
            raise FileNotFoundError(f"sample_jds.json not found at {json_path}")
        
        with open(json_path, "r") as f:
            return json.load(f)

    def calculate_semantic_scores(self, resume_text: str, job_texts: list) -> list:
        """
        Calculate semantic similarity using sentence transformers
        
        Process:
        1. Encode resume as semantic vector
        2. Encode all jobs as semantic vectors
        3. Calculate cosine similarity (0-1 range)
        
        Returns: List of scores (0-1)
        """
        # Encode resume and jobs into embeddings
        resume_embedding = self.semantic_model.encode([resume_text])
        job_embeddings = self.semantic_model.encode(job_texts)
        
        # Calculate cosine similarity between resume and each job
        semantic_scores = cosine_similarity(resume_embedding, job_embeddings)[0]
        
        return semantic_scores.tolist()

    def calculate_tfidf_scores(self, resume_text: str, job_texts: list) -> list:
        """
        Calculate TF-IDF similarity using keyword frequency
        
        Process:
        1. Vectorize resume and jobs using TF-IDF
        2. Calculate term frequency importance
        3. Calculate cosine similarity
        
        Returns: List of scores (0-1)
        """
        # Combine all texts for vectorizer
        all_texts = [resume_text] + job_texts
        
        # Create TF-IDF vectors
        vectorizer = TfidfVectorizer(
            max_features=500,           # Limit to 500 most important terms
            stop_words='english',        # Remove common English words
            lowercase=True
        )
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        
        # Calculate similarity between resume (index 0) and jobs (index 1+)
        tfidf_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]
        
        return tfidf_scores.tolist()

    def calculate_hybrid_score(self, semantic_score: float, tfidf_score: float, 
                              semantic_weight: float = 0.7, tfidf_weight: float = 0.3) -> float:
        """
        Combine semantic and TF-IDF scores with weighted average
        
        Formula: (semantic_score * weight1) + (tfidf_score * weight2)
        
        Default weights:
        - Semantic: 70% (better for understanding meaning)
        - TF-IDF: 30% (better for exact keyword matching)
        
        Args:
            semantic_score: Score from semantic matching (0-1)
            tfidf_score: Score from TF-IDF matching (0-1)
            semantic_weight: Weight for semantic score (default 0.7)
            tfidf_weight: Weight for TF-IDF score (default 0.3)
        
        Returns: Combined score (0-1)
        """
        hybrid_score = (semantic_score * semantic_weight) + (tfidf_score * tfidf_weight)
        return round(float(hybrid_score), 4)

    def calculate_match_percentage(self, hybrid_score: float) -> float:
        """
        Convert hybrid score (0-1) to percentage (0-100)
        
        Args:
            hybrid_score: Score in range 0-1
        
        Returns: Percentage match (0-100)
        """
        return round(hybrid_score * 100, 2)

    def recommend_jobs_hybrid(self, resume_skills: list, top_n: int = 5) -> dict:
        """
        Get job recommendations using hybrid matching
        
        Returns detailed matching information including:
        - Individual semantic and TF-IDF scores
        - Combined hybrid score
        - Match percentage
        
        Args:
            resume_skills: List of skills from resume (e.g., ["Python", "SQL", "Excel"])
            top_n: Number of top recommendations to return
        
        Returns:
            Dictionary with:
            {
                "total_jobs": int,
                "matches": [
                    {
                        "id": str,
                        "title": str,
                        "company": str,
                        "semantic_score": float (0-1),
                        "tfidf_score": float (0-1),
                        "hybrid_score": float (0-1),
                        "match_percentage": float (0-100),
                        "rank": int
                    }
                ]
            }
        """
        # Load job data
        jobs = self.load_sample_jobs()
        
        # Create resume text from skills
        resume_text = " ".join(resume_skills)
        
        # Extract job descriptions
        job_texts = [job.get("description", "") for job in jobs]
        
        # Calculate both types of scores
        print("🔄 Calculating semantic scores...")
        semantic_scores = self.calculate_semantic_scores(resume_text, job_texts)
        
        print("🔄 Calculating TF-IDF scores...")
        tfidf_scores = self.calculate_tfidf_scores(resume_text, job_texts)
        
        # Combine scores and create results
        print("🔄 Combining scores...")
        job_matches = []
        
        for idx, (job, sem_score, tf_score) in enumerate(zip(jobs, semantic_scores, tfidf_scores)):
            # Calculate hybrid score
            hybrid_score = self.calculate_hybrid_score(sem_score, tf_score)
            
            # Convert to percentage
            match_percentage = self.calculate_match_percentage(hybrid_score)
            
            job_matches.append({
                "id": job.get("id", str(idx)),
                "title": job.get("title", "Unknown"),
                "company": job.get("company", "Unknown"),
                "description": job.get("description", ""),
                "semantic_score": round(float(sem_score), 4),      # 0-1
                "tfidf_score": round(float(tf_score), 4),          # 0-1
                "hybrid_score": hybrid_score,                       # 0-1 (weighted)
                "match_percentage": match_percentage,               # 0-100
                "semantic_percentage": round(float(sem_score) * 100, 2),
                "tfidf_percentage": round(float(tf_score) * 100, 2)
            })
        
        # Sort by hybrid score (highest first)
        job_matches.sort(key=lambda x: x["hybrid_score"], reverse=True)
        
        # Add rank
        for rank, match in enumerate(job_matches, 1):
            match["rank"] = rank
        
        # Return top N
        return {
            "total_jobs": len(jobs),
            "resume_skills": resume_skills,
            "matches": job_matches[:top_n],
            "all_matches": job_matches  # For detailed analysis
        }

    def get_detailed_comparison(self, resume_skills: list) -> dict:
        """
        Get detailed comparison of all matching methods
        Useful for understanding how different algorithms rate jobs
        
        Returns:
            Dictionary with breakdown for each job showing:
            - Semantic ranking
            - TF-IDF ranking
            - Hybrid ranking
            - Individual percentages
        """
        jobs = self.load_sample_jobs()
        resume_text = " ".join(resume_skills)
        job_texts = [job.get("description", "") for job in jobs]
        
        semantic_scores = self.calculate_semantic_scores(resume_text, job_texts)
        tfidf_scores = self.calculate_tfidf_scores(resume_text, job_texts)
        
        results = {
            "semantic_ranking": [],
            "tfidf_ranking": [],
            "hybrid_ranking": [],
            "detailed_breakdown": []
        }
        
        job_details = []
        for idx, (job, sem_score, tf_score) in enumerate(zip(jobs, semantic_scores, tfidf_scores)):
            hybrid_score = self.calculate_hybrid_score(sem_score, tf_score)
            
            detail = {
                "job_id": job.get("id", str(idx)),
                "title": job.get("title", "Unknown"),
                "semantic_score": round(float(sem_score), 4),
                "tfidf_score": round(float(tf_score), 4),
                "hybrid_score": hybrid_score,
                "semantic_percentage": round(float(sem_score) * 100, 2),
                "tfidf_percentage": round(float(tf_score) * 100, 2),
                "hybrid_percentage": round(hybrid_score * 100, 2)
            }
            job_details.append(detail)
        
        # Sort by each metric
        semantic_sorted = sorted(job_details, key=lambda x: x["semantic_score"], reverse=True)
        tfidf_sorted = sorted(job_details, key=lambda x: x["tfidf_score"], reverse=True)
        hybrid_sorted = sorted(job_details, key=lambda x: x["hybrid_score"], reverse=True)
        
        # Add rank to each
        for rank, job in enumerate(semantic_sorted, 1):
            results["semantic_ranking"].append({"rank": rank, **job})
        
        for rank, job in enumerate(tfidf_sorted, 1):
            results["tfidf_ranking"].append({"rank": rank, **job})
        
        for rank, job in enumerate(hybrid_sorted, 1):
            results["hybrid_ranking"].append({"rank": rank, **job})
        
        results["detailed_breakdown"] = job_details
        
        return results


# Convenience functions for backward compatibility
def recommend_jobs_hybrid(resume_skills: list, top_n: int = 5) -> dict:
    """Quick function to get hybrid recommendations"""
    matcher = HybridJobMatcher()
    return matcher.recommend_jobs_hybrid(resume_skills, top_n)


def get_match_percentage(resume_skills: list, job_title: str = None) -> dict:
    """Get match percentages for all jobs"""
    matcher = HybridJobMatcher()
    results = matcher.recommend_jobs_hybrid(resume_skills, top_n=10)
    return results


if __name__ == "__main__":
    # Example usage
    test_skills = ["Python", "SQL", "Excel", "Data Analysis"]
    
    matcher = HybridJobMatcher()
    
    print("\n" + "="*80)
    print("HYBRID JOB MATCHING - DETAILED ANALYSIS")
    print("="*80 + "\n")
    
    # Get hybrid recommendations
    print("📊 HYBRID RECOMMENDATIONS (Top 5):")
    print("-" * 80)
    results = matcher.recommend_jobs_hybrid(test_skills, top_n=5)
    
    for match in results["matches"]:
        print(f"\n🎯 {match['rank']}. {match['title']} at {match['company']}")
        print(f"   Match Percentage: {match['match_percentage']}%")
        print(f"   ├─ Semantic:  {match['semantic_percentage']}% (Score: {match['semantic_score']})")
        print(f"   ├─ TF-IDF:    {match['tfidf_percentage']}% (Score: {match['tfidf_score']})")
        print(f"   └─ Hybrid:    {match['hybrid_percentage']}% (Score: {match['hybrid_score']})")
    
    # Get detailed comparison
    print("\n\n" + "="*80)
    print("DETAILED COMPARISON - ALL MATCHING METHODS")
    print("="*80 + "\n")
    
    comparison = matcher.get_detailed_comparison(test_skills)
    
    print("SEMANTIC RANKING (Based on Meaning Similarity):")
    print("-" * 80)
    for job in comparison["semantic_ranking"][:3]:
        print(f"{job['rank']}. {job['title']}: {job['semantic_percentage']}%")
    
    print("\n\nTF-IDF RANKING (Based on Keyword Frequency):")
    print("-" * 80)
    for job in comparison["tfidf_ranking"][:3]:
        print(f"{job['rank']}. {job['title']}: {job['tfidf_percentage']}%")
    
    print("\n\nHYBRID RANKING (Combined - Recommended):")
    print("-" * 80)
    for job in comparison["hybrid_ranking"][:3]:
        print(f"{job['rank']}. {job['title']}: {job['hybrid_percentage']}% " +
              f"(Semantic: {job['semantic_percentage']}% + TF-IDF: {job['tfidf_percentage']}%)")
    
    print("\n" + "="*80)
