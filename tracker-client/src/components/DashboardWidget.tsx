"use client";
import React from 'react';
import { X, Move, Settings } from 'lucide-react';

interface WidgetData {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
  color?: string;
}

interface DashboardWidgetProps {
  widget: WidgetData;
  onRemove?: (id: string) => void;
  onEdit?: (id: string) => void;
  isDragging?: boolean;
  isEditing?: boolean;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  widget,
  onRemove,
  onEdit,
  isDragging = false,
  isEditing = false,
}) => {
  const getChangeColor = (type: 'increase' | 'decrease') => {
    return type === 'increase' ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (type: 'increase' | 'decrease') => {
    return type === 'increase' ? '↗' : '↘';
  };

  return (
    <div
      className={`relative dashboard-widget rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {widget.icon && (
            <div className={`p-2 rounded-lg ${widget.color || 'bg-blue-100 dark:bg-blue-900'}`}>
              {widget.icon}
            </div>
          )}
          <h3 className="font-semibold widget-title">{widget.title}</h3>
        </div>
        
        {isEditing && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit?.(widget.id)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRemove?.(widget.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Widget Content */}
      <div className="space-y-2">
        <div className="text-2xl font-bold widget-value">
          {typeof widget.value === 'number' ? widget.value.toFixed(2) : widget.value}
        </div>
        
        {widget.change !== undefined && (
          <div className="flex items-center space-x-1">
            <span className={`text-sm font-medium ${getChangeColor(widget.changeType!)}`}>
              {getChangeIcon(widget.changeType!)} {Math.abs(widget.change)}%
            </span>
            <span className="text-sm widget-text">from last month</span>
          </div>
        )}
      </div>

      {/* Drag Handle */}
      {isEditing && (
        <div className="absolute top-2 right-2 cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Move className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default DashboardWidget; 