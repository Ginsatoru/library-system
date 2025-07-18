import { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Bell, 
  User, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  HelpCircle,
  Cog
} from 'lucide-react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    reminders: true
  });
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '',
    timezone: 'UTC-5'
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showReadingProgress: true,
    allowDataCollection: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  const sections = [
    { id: 'general', label: 'General', icon: Cog },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Globe }
  ];

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setHasChanges(true);
  };

  const updateProfile = (key, value) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const updatePrivacy = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Simulate saving
    setTimeout(() => {
      setHasChanges(false);
    }, 1000);
  };

  const ToggleSwitch = ({ enabled, onToggle, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{label}</p>
        {description && <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{description}</p>}
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          enabled ? 'bg-blue-600' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>General Settings</h3>
        
        <div className="space-y-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-lg`}>
                  <Globe className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Language</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Choose your preferred language</p>
                </div>
              </div>
              <select className={`px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${darkMode ? 'bg-green-900/30' : 'bg-green-100'} rounded-lg`}>
                  <RefreshCw className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Auto-sync</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Automatically sync across devices</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={true}
                onToggle={() => setHasChanges(true)}
                label=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Appearance</h3>
        
        <div className="space-y-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'} rounded-lg`}>
                  {darkMode ? <Moon className={`h-5 w-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} /> : <Sun className={`h-5 w-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Toggle between light and dark themes</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={darkMode}
                onToggle={() => setDarkMode(!darkMode)}
                label=""
              />
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Theme Color</p>
            <div className="flex gap-3">
              {['blue', 'purple', 'green', 'orange', 'red'].map(color => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full bg-${color}-500 hover:scale-110 transition-transform ${
                    color === 'blue' ? `ring-2 ring-offset-2 ring-blue-500 ${darkMode ? 'ring-offset-gray-800' : 'ring-offset-white'}` : ''
                  }`}
                  onClick={() => setHasChanges(true)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Notifications</h3>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
          <div className="space-y-4">
            <ToggleSwitch
              enabled={notifications.email}
              onToggle={() => toggleNotification('email')}
              label="Email Notifications"
              description="Receive updates via email"
            />
            <ToggleSwitch
              enabled={notifications.push}
              onToggle={() => toggleNotification('push')}
              label="Push Notifications"
              description="Get notifications on your device"
            />
            <ToggleSwitch
              enabled={notifications.sms}
              onToggle={() => toggleNotification('sms')}
              label="SMS Notifications"
              description="Receive text message alerts"
            />
            <ToggleSwitch
              enabled={notifications.reminders}
              onToggle={() => toggleNotification('reminders')}
              label="Reading Reminders"
              description="Get reminded about due dates"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Profile Information</h3>
        
        <div className="space-y-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
                <User className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Change Avatar
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile('name', e.target.value)}
                  className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile('email', e.target.value)}
                  className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Timezone</label>
                <select
                  value={profile.timezone}
                  onChange={(e) => updateProfile('timezone', e.target.value)}
                  className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="UTC-5">UTC-5 (Eastern)</option>
                  <option value="UTC-6">UTC-6 (Central)</option>
                  <option value="UTC-7">UTC-7 (Mountain)</option>
                  <option value="UTC-8">UTC-8 (Pacific)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Privacy & Security</h3>
        
        <div className="space-y-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Profile Visibility</label>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => updatePrivacy('profileVisibility', e.target.value)}
                  className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              <ToggleSwitch
                enabled={privacy.showReadingProgress}
                onToggle={() => updatePrivacy('showReadingProgress', !privacy.showReadingProgress)}
                label="Show Reading Progress"
                description="Allow others to see your reading progress"
              />
              
              <ToggleSwitch
                enabled={privacy.allowDataCollection}
                onToggle={() => updatePrivacy('allowDataCollection', !privacy.allowDataCollection)}
                label="Allow Data Collection"
                description="Help improve the app by sharing usage data"
              />
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Change Password</h4>
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full px-3 py-2 pr-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>New Password</label>
                <input
                  type="password"
                  className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Confirm New Password</label>
                <input
                  type="password"
                  className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Advanced Settings</h3>
        
        <div className="space-y-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Data Management</h4>
            <div className="space-y-3">
              <button className={`w-full flex items-center justify-between px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-lg transition-colors`}>
                <div className="flex items-center gap-3">
                  <Download className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Export Data</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              
              <button className={`w-full flex items-center justify-between px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-lg transition-colors`}>
                <div className="flex items-center gap-3">
                  <Upload className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Import Data</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              
              <button className={`w-full flex items-center justify-between px-4 py-3 ${darkMode ? 'bg-gray-700 border-red-600 hover:bg-red-900/20' : 'bg-white border-red-200 hover:bg-red-50'} border rounded-lg transition-colors`}>
                <div className="flex items-center gap-3">
                  <Trash2 className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Delete All Data</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Support</h4>
            <div className="space-y-3">
              <button className={`w-full flex items-center justify-between px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-lg transition-colors`}>
                <div className="flex items-center gap-3">
                  <HelpCircle className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Help Center</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              
              <button className={`w-full flex items-center justify-between px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-lg transition-colors`}>
                <div className="flex items-center gap-3">
                  <Mail className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contact Support</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'profile':
        return renderProfileSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'advanced':
        return renderAdvancedSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: darkMode ? '#111827' : '#ffffff' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                Settings
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                Manage your account preferences and app settings
              </p>
            </div>
            
            {hasChanges && (
              <button
                onClick={handleSave}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-2xl p-4 border`}>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-2xl shadow-sm border overflow-hidden`}>
              <div className="p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;