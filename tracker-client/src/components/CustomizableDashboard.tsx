"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Settings, Save, X } from 'lucide-react';
import DashboardWidget from './DashboardWidget';
import { TrendingUp, TrendingDown, Wallet, DollarSign, PiggyBank, Target } from 'lucide-react';

interface WidgetData {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
  color?: string;
  type: string;
}

interface CustomizableDashboardProps {
  todayExpenseSum: number;
  todayIncomeSum: number;
  monthlyBalance: number;
  onWidgetChange?: (widgets: WidgetData[]) => void;
}

const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({
  todayExpenseSum,
  todayIncomeSum,
  monthlyBalance,
  onWidgetChange,
}) => {
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);

  // Available widget types
  const availableWidgets = [
    {
      id: 'today-expenses',
      title: "Today's Expenses",
      value: todayExpenseSum,
      change: 12,
      changeType: 'increase' as const,
      icon: <TrendingDown className="w-5 h-5 text-red-500" />,
      color: 'bg-red-100 dark:bg-red-900',
      type: 'expense'
    },
    {
      id: 'today-incomes',
      title: "Today's Incomes",
      value: todayIncomeSum,
      change: 8,
      changeType: 'increase' as const,
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      color: 'bg-green-100 dark:bg-green-900',
      type: 'income'
    },
    {
      id: 'monthly-balance',
      title: "Monthly Balance",
      value: monthlyBalance,
      change: monthlyBalance >= 0 ? 15 : -5,
      changeType: monthlyBalance >= 0 ? 'increase' as const : 'decrease' as const,
      icon: <Wallet className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-100 dark:bg-blue-900',
      type: 'balance'
    },
    {
      id: 'savings-goal',
      title: "Savings Goal",
      value: "75%",
      icon: <Target className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-100 dark:bg-purple-900',
      type: 'goal'
    },
    {
      id: 'total-savings',
      title: "Total Savings",
      value: 15000,
      change: 20,
      changeType: 'increase' as const,
      icon: <PiggyBank className="w-5 h-5 text-yellow-500" />,
      color: 'bg-yellow-100 dark:bg-yellow-900',
      type: 'savings'
    }
  ];

  // Initialize default widgets
  useEffect(() => {
    const defaultWidgets = availableWidgets.slice(0, 3);
    setWidgets(defaultWidgets);
  }, [todayExpenseSum, todayIncomeSum, monthlyBalance]);

  const handleAddWidget = (widgetType: string) => {
    const widget = availableWidgets.find(w => w.id === widgetType);
    if (widget && !widgets.find(w => w.id === widget.id)) {
      const newWidgets = [...widgets, widget];
      setWidgets(newWidgets);
      onWidgetChange?.(newWidgets);
    }
    setShowAddWidget(false);
  };

  const handleRemoveWidget = (id: string) => {
    const newWidgets = widgets.filter(w => w.id !== id);
    setWidgets(newWidgets);
    onWidgetChange?.(newWidgets);
  };

  const handleEditWidget = (id: string) => {
    // Implement widget editing functionality
    console.log('Edit widget:', id);
  };

  const handleSaveLayout = () => {
    setIsEditing(false);
    // Save layout to localStorage or backend
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold dashboard-header">Dashboard</h2>
        
        <div className="flex items-center space-x-2">
          {isEditing && (
            <>
              <button
                onClick={() => setShowAddWidget(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Widget</span>
              </button>
              
              <button
                onClick={handleSaveLayout}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Layout</span>
              </button>
            </>
          )}
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isEditing 
                ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Customize'}</span>
          </button>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-transparent">
        {widgets.map((widget) => (
          <DashboardWidget
            key={widget.id}
            widget={widget}
            onRemove={isEditing ? handleRemoveWidget : undefined}
            onEdit={isEditing ? handleEditWidget : undefined}
            isEditing={isEditing}
          />
        ))}
      </div>

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Add Widget
              </h3>
              <button
                onClick={() => setShowAddWidget(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {availableWidgets
                .filter(widget => !widgets.find(w => w.id === widget.id))
                .map((widget) => (
                  <button
                    key={widget.id}
                    onClick={() => handleAddWidget(widget.id)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${widget.color}`}>
                      {widget.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {widget.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {widget.type}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizableDashboard; 