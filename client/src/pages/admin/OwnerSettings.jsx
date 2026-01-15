import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OwnerSidebar from '../../components/OwnerSidebar'
import Navbar from '../../components/Navbar'
import GlassCard from '../../components/ui/GlassCard'
import API from '../../api/axios'
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Smartphone,
  Mail,
  ShieldCheck,
  Globe,
  Key,
  Save,
  RefreshCcw,
  Zap,
  Sparkles
} from 'lucide-react'

export default function OwnerSettings() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: {
      email: true,
      sms: false,
      inApp: true,
    },
    systemConfig: {
      maintenanceMode: false,
      apiKey: ''
    }
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await API.get('/owner/settings')
      setSettings(res.data)
    } catch (err) {
      console.error('Error fetching settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await API.post('/owner/settings', settings)
      alert('Settings saved successfully!')
    } catch (err) {
      console.error('Error saving settings:', err)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const toggleNotification = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }))
  }

  const updateSystemConfig = (field, value) => {
    setSettings(prev => ({
      ...prev,
      systemConfig: {
        ...prev.systemConfig,
        [field]: value
      }
    }))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex pt-16 h-screen overflow-hidden">
        <OwnerSidebar />

        <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Settings
              </h1>
              <p className="text-gray-500 font-medium">Configure administrative preferences and system parameters</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={saving || loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all flex items-center gap-2 disabled:opacity-50 text-xs uppercase tracking-widest"
            >
              {saving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Settings'}
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Theme & Notifications */}
            <div className="space-y-8">
              {/* Theme Selection */}
              <GlassCard className="p-8 border-white/60" glow={false}>
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Zap size={24} className="text-amber-500" /> Personalization
                </h3>

                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-purple-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      {settings.theme === 'dark' ? <Moon className="text-purple-600" /> : <Sun className="text-amber-500" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 capitalize">{settings.theme} Mode</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Toggle platform appearance</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }))}
                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${settings.theme === 'dark' ? 'bg-purple-600' : 'bg-slate-200'}`}
                  >
                    <motion.div
                      layout
                      className="w-6 h-6 bg-white rounded-full shadow-lg"
                      animate={{ x: settings.theme === 'dark' ? 24 : 0 }}
                    />
                  </button>
                </div>
              </GlassCard>

              {/* Notifications */}
              <GlassCard className="p-8 border-white/60" glow={false}>
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Bell size={24} className="text-rose-500" /> Notifications
                </h3>

                <div className="space-y-4">
                  {[
                    { id: 'email', label: 'Email Alerts', icon: Mail, color: 'text-purple-500', desc: 'Receive critical updates via email' },
                    { id: 'sms', label: 'SMS Notifications', icon: Smartphone, color: 'text-pink-500', desc: 'Direct alerts to your mobile device' },
                    { id: 'inApp', label: 'In-App Message', icon: Bell, color: 'text-indigo-500', desc: 'Notifications within the dashboard' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-purple-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <item.icon className={item.color} size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{item.label}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleNotification(item.id)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.notifications[item.id] ? 'bg-purple-600' : 'bg-slate-200'}`}
                      >
                        <motion.div
                          layout
                          className="w-4 h-4 bg-white rounded-full shadow-lg"
                          animate={{ x: settings.notifications[item.id] ? 24 : 0 }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* System Config */}
            <div className="space-y-8">
              <GlassCard className="p-8 border-white/60 h-full" glow={false}>
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <ShieldCheck size={24} className="text-purple-600" /> System Configuration
                </h3>

                <div className="space-y-6">
                  {/* Maintenance Mode */}
                  <div className="p-5 bg-purple-50/30 border border-purple-100/50 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Globe className="text-purple-600" size={20} />
                        <span className="font-bold text-slate-800 uppercase tracking-widest">Maintenance Mode</span>
                      </div>
                      <button
                        onClick={() => updateSystemConfig('maintenanceMode', !settings.systemConfig.maintenanceMode)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.systemConfig.maintenanceMode ? 'bg-rose-500' : 'bg-slate-200'}`}
                      >
                        <motion.div
                          layout
                          className="w-4 h-4 bg-white rounded-full shadow-lg"
                          animate={{ x: settings.systemConfig.maintenanceMode ? 24 : 0 }}
                        />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                      When enabled, only administrators can access the platform. Public users will see a maintenance page.
                    </p>
                  </div>

                  {/* API Key */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      External AI Engine Key
                    </label>
                    <div className="relative group">
                      <input
                        type="password"
                        value={settings.systemConfig.apiKey}
                        onChange={(e) => updateSystemConfig('apiKey', e.target.value)}
                        placeholder="••••••••••••••••"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all font-medium"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-purple-500 transition-colors cursor-help">
                        <Zap size={18} />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 tracking-widest">
                      Used for integrating with third-party ML and notification services.
                    </p>
                  </div>

                  {/* Quick Status */}
                  <div className="mt-8 p-6 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative group border border-white/5">
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                    <div className="relative z-10">
                      <h5 className="text-purple-400 font-bold text-[10px] uppercase tracking-widest mb-4">Core System Status</h5>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-3xl font-bold tracking-tight">Operational</span>
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">Latency: 14ms | Uptime: 99.9%</span>
                        </div>
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 transition-colors">
                          <ShieldCheck className="text-purple-400" size={28} />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50" />
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
