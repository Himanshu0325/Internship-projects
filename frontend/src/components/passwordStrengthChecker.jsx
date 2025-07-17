import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

export const PasswordStrengthChecker = ({ 
  label,
  password, 
  onPasswordChange, 
  onStrengthChange,
  showError,
  onFocus 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({
    score: 0,
    level: 'Very Weak',
    color: 'bg-red-500',
    isStrong: false,
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
      noCommon: true
    }
  });

  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];

  const checkPasswordStrength = (pwd) => {
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      noCommon: !commonPasswords.some(common => 
        pwd.toLowerCase().includes(common.toLowerCase())
      )
    };

    const score = Object.values(checks).filter(Boolean).length;
    
    let level, color, isStrong;
    if (score <= 2) {
      level = 'Very Weak';
      color = 'bg-red-500';
      isStrong = false;
    } else if (score <= 3) {
      level = 'Weak';
      color = 'bg-orange-500';
      isStrong = false;
    } else if (score <= 4) {
      level = 'Fair';
      color = 'bg-yellow-500';
      isStrong = false;
    } else if (score <= 5) {
      level = 'Good';
      color = 'bg-blue-500';
      isStrong = true;
    } else {
      level = 'Strong';
      color = 'bg-green-500';
      isStrong = true;
    }

    return { score, level, color, isStrong, checks };
  };

  useEffect(() => {
    if (password) {
      const newStrength = checkPasswordStrength(password);
      setStrength(newStrength);
      if (onStrengthChange) {
        onStrengthChange(newStrength);
      }
    } else {
      const emptyStrength = {
        score: 0,
        level: 'Very Weak',
        color: 'bg-red-500',
        isStrong: false,
        checks: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
          noCommon: true
        }
      };
      setStrength(emptyStrength);
      if (onStrengthChange) {
        onStrengthChange(emptyStrength);
      }
    }
  }, [password]);

  const CheckItem = ({ label, isValid }) => (
    <div className={`flex items-center space-x-2 text-xs ${isValid ? 'text-[#16a34a]' : 'text-[#6b7280]'}`}>
      {isValid ? <Check size={12} /> : <X size={12} />}
      <span>{label}</span>
    </div>
  );

  return (
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        {label ? label :'Password'}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={password}
          required
          className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onChange={onPasswordChange}
          onClick={onFocus}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute  transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent border-0"
          style={{right:'1rem' , top:'1.2rem'}}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Error message - matching your form's error style */}
      {showError && (
        <div className={`${!password ? 'visible' : 'hidden'} text-[#d62626]`}>
          {`! ${label ? label : 'Password'} is required`}
        </div>
      )}

      {/* Password strength indicator */}
      {password && (
        <div className="mt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Strength:</span>
            <span className={`text-xs font-medium ${
              strength.level === 'Strong' ? 'text-[#16a34a]' :
              strength.level === 'Good' ? 'text-[#2563eb]' :
              strength.level === 'Fair' ? 'text-[#ca8a04] ' :
              strength.level === 'Weak' ? 'text-[#ea580c]' : 'text-[#d62626]'
            }`}>
              {strength.level}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${strength.color}`}
              style={{ width: `${(strength.score / 6) * 100}%` }}
            />
          </div>

          {/* Compact requirements list */}
          <div className="grid grid-cols-2 gap-1 text-xs">
            <CheckItem label="8+ chars" isValid={strength.checks.length} />
            <CheckItem label="Uppercase" isValid={strength.checks.uppercase} />
            <CheckItem label="Lowercase" isValid={strength.checks.lowercase} />
            <CheckItem label="Number" isValid={strength.checks.number} />
            <CheckItem label="Special char" isValid={strength.checks.special} />
            <CheckItem label="Not common" isValid={strength.checks.noCommon} />
          </div>
        </div>
      )}
    </div>
  );
};

