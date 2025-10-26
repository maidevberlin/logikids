import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Gender } from '../types';

interface ProfilePromptProps {
  onSave: (age: number, gender: Gender | null) => void;
  onSkip: () => void;
}

export function ProfilePrompt({ onSave, onSkip }: ProfilePromptProps) {
  const { t } = useTranslation();
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<Gender | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age, 10);
    if (ageNum >= 8 && ageNum <= 16) {
      onSave(ageNum, gender);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const isValid = age && parseInt(age, 10) >= 8 && parseInt(age, 10) <= 16;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t('profile.prompt.title')}
        </h2>

        <p className="text-gray-600 mb-6">
          {t('profile.prompt.description')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Age Input */}
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('profile.prompt.age.label')}
            </label>
            <input
              id="age"
              type="number"
              min="8"
              max="16"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder={t('profile.prompt.age.placeholder')}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('profile.prompt.age.hint')}
            </p>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profile.prompt.gender.label')}
            </label>
            <div className="space-y-2">
              {(['male', 'female', 'non-binary', 'prefer-not-to-say'] as const).map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={gender === option}
                    onChange={() => setGender(option)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">
                    {t(`profile.prompt.gender.options.${option}`)}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {t('profile.prompt.gender.hint')}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('profile.prompt.skip')}
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {t('profile.prompt.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
