'use client';

import { useMemo } from 'react';
import { Check, X } from 'lucide-react';

type PasswordStrengthMeterProps = {
  password?: string;
};

export function PasswordStrengthMeter({ password = '' }: PasswordStrengthMeterProps) {
  const analysis = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!password) {
      return {
        score: 0,
        label: '',
        color: 'bg-slate-700',
        textColor: 'text-slate-500',
        checks: [
          { label: '8+ characters', pass: false },
          { label: 'Upper & lowercase', pass: false },
          { label: 'Number', pass: false },
          { label: 'Special symbol', pass: false },
        ],
      };
    }

    const passedCount = [
      hasMinLength,
      hasUpperCase && hasLowerCase,
      hasNumber,
      hasSpecial,
    ].filter(Boolean).length;

    let score = 1;
    let label = 'Weak';
    let color = 'bg-rose-500';
    let textColor = 'text-rose-400';

    if (!hasMinLength) {
      score = 1;
      label = 'Too short (min 8 chars)';
      color = 'bg-rose-500';
      textColor = 'text-rose-400';
    } else if (passedCount === 4 && password.length >= 10) {
      score = 4;
      label = 'Strong';
      color = 'bg-emerald-500';
      textColor = 'text-emerald-400';
    } else if (passedCount >= 3) {
      score = 3;
      label = 'Good';
      color = 'bg-brand-400';
      textColor = 'text-brand-300';
    } else if (passedCount >= 2) {
      score = 2;
      label = 'Fair';
      color = 'bg-amber-500';
      textColor = 'text-amber-400';
    } else {
      score = 1;
      label = 'Weak';
      color = 'bg-rose-500';
      textColor = 'text-rose-400';
    }

    return {
      score,
      label,
      color,
      textColor,
      checks: [
        { label: '8+ characters', pass: hasMinLength },
        { label: 'Upper & lowercase', pass: hasUpperCase && hasLowerCase },
        { label: 'Number', pass: hasNumber },
        { label: 'Special symbol', pass: hasSpecial },
      ],
    };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2.5 pt-1" aria-live="polite">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-[0.62rem] uppercase tracking-wider text-slate-400">
          Password strength
        </span>
        <span className={`font-semibold ${analysis.textColor}`}>
          {analysis.label}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5" role="progressbar" aria-valuenow={analysis.score} aria-valuemin={0} aria-valuemax={4}>
        {[1, 2, 3, 4].map((step) => {
          const isActive = analysis.score >= step;
          return (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive ? analysis.color : 'bg-slate-800'
              }`}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 pt-0.5 text-[0.68rem]">
        {analysis.checks.map((item) => (
          <span
            key={item.label}
            className={`inline-flex items-center gap-1 transition-colors ${
              item.pass ? 'text-emerald-400 font-medium' : 'text-slate-500'
            }`}
          >
            {item.pass ? <Check size={11} className="shrink-0" /> : <X size={11} className="shrink-0 opacity-60" />}
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
