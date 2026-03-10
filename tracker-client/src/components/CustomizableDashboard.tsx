"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Settings, Save, X, Lightbulb, ArrowUpRight } from 'lucide-react';
import DashboardWidget from './DashboardWidget';
import { LuActivity, LuPiggyBank, LuTarget, LuWallet } from "react-icons/lu";
import { FaChartColumn, FaRegCalendar } from "react-icons/fa6";
import { FiPieChart } from 'react-icons/fi';
import { HiMiniArrowTrendingDown, HiMiniArrowTrendingUp } from 'react-icons/hi2';
import { TbBulb } from 'react-icons/tb';



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
  monthlyBalance: number;
  monthlyExpenseTotal: number;
  monthlyIncome: number;
  totalEntries: number;
  onWidgetChange?: (widgets: WidgetData[]) => void;
  onAddClick?: () => void;
}

const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({
  monthlyBalance,
  monthlyExpenseTotal,
  monthlyIncome,
  totalEntries,
  onWidgetChange,
  onAddClick,
}) => {
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate real percentage changes
  const calculatePercentageChange = useCallback((current: number, previous: number): number => {
    if (!mounted) return 0;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }, [mounted]);

  // Calculate savings rate
  const calculateSavingsRate = (): number => {
    if (!mounted) return 0;
    if (monthlyIncome === 0) return 0;
    const savings = monthlyIncome - monthlyExpenseTotal;
    return Math.round((savings / monthlyIncome) * 100);
  };

  // Get financial status with enhanced logic
  const getFinancialStatus = () => {
    if (!mounted) return { status: 'Loading...', color: 'text-gray-600' };
    if (monthlyIncome === 0 && monthlyExpenseTotal === 0) {
      return { status: 'No Data', color: 'text-gray-600' };
    }
    
    const savingsRate = calculateSavingsRate();
    const balance = monthlyBalance;
    
    // Excellent: High savings rate and positive balance
    if (savingsRate >= 30 && balance > 0) {
      return { status: 'Excellent', color: 'text-emerald-600' };
    }
    
    // Good: Good savings rate and positive balance
    if (savingsRate >= 20 && balance > 0) {
      return { status: 'On Track', color: 'text-green-600' };
    }
    
    // Fair: Positive balance but low savings
    if (balance >= 0 && savingsRate < 20) {
      return { status: 'Fair', color: 'text-yellow-600' };
    }
    
    // Over Budget: Negative balance
    if (balance < 0) {
      return { status: 'Over Budget', color: 'text-red-600' };
    }
    
    // Default
    return { status: 'Unknown', color: 'text-gray-600' };
  };

  const getAvailableWidgets = useCallback(() => {
    if (!mounted) return [];
    
    return [
      {
        id: 'monthly-expenses',
        title: "Monthly Expenses",
        value: monthlyExpenseTotal,
        change: calculatePercentageChange(monthlyExpenseTotal, monthlyExpenseTotal * 0.9),
        changeType: (monthlyExpenseTotal > (monthlyExpenseTotal * 0.9)) ? 'increase' as const : 'decrease' as const,
        icon: <HiMiniArrowTrendingDown className="w-5 h-5 text-red-700" />,
        color: 'widget-icon-red',
        type: 'expense'
      },
      {
        id: 'monthly-incomes',
        title: "Monthly Incomes",
        value: monthlyIncome,
        change: calculatePercentageChange(monthlyIncome, monthlyIncome * 0.9),
        changeType: (monthlyIncome > (monthlyIncome * 0.9)) ? 'increase' as const : 'decrease' as const,
        icon: <HiMiniArrowTrendingUp className="w-5 h-5 text-[#15994e]" />,
        color: 'widget-icon-green',
        type: 'income'
      },
      {
        id: 'monthly-balance',
        title: "Monthly Balance",
        value: monthlyBalance,
        change: calculatePercentageChange(monthlyBalance, monthlyIncome * 0.1),
        changeType: monthlyBalance >= 0 ? 'increase' as const : 'decrease' as const,
        icon: <LuWallet className="w-5 h-5 text-blue-700" />,
        color: 'widget-icon-blue',
        type: 'balance'
      },
      {
        id: 'savings-goal',
        title: "Savings Rate",
        value: `${calculateSavingsRate()}%`,
        change: calculateSavingsRate() - 20,
        changeType: calculateSavingsRate() >= 20 ? 'increase' as const : 'decrease' as const,
        icon: <LuTarget className="w-5 h-5 text-purple-700" />,
        color: 'widget-icon-purple',
        type: 'goal'
      },
      {
        id: 'total-savings',
        title: "Monthly Savings",
        value: monthlyBalance,
        change: calculatePercentageChange(monthlyBalance, monthlyIncome * 0.15),
        changeType: monthlyBalance >= (monthlyIncome * 0.15) ? 'increase' as const : 'decrease' as const,
        icon: <LuPiggyBank className="w-5 h-5 text-yellow-700" />,
        color: 'widget-icon-yellow',
        type: 'savings'
      }
    ];
  }, [mounted, monthlyExpenseTotal, monthlyIncome, monthlyBalance, calculatePercentageChange, calculateSavingsRate]);



  // Initialize widgets - load from localStorage or use defaults
  useEffect(() => {
    if (mounted) {
      const savedWidgetIds = localStorage.getItem('dashboard-widget-ids');
      const availableWidgets = getAvailableWidgets();
      
      if (savedWidgetIds) {
        try {
          const widgetIds = JSON.parse(savedWidgetIds) as string[];
          // Rebuild widgets with current data based on saved IDs
          const restoredWidgets: WidgetData[] = [];
          widgetIds.forEach((id: string) => {
            const widget = availableWidgets.find(w => w.id === id);
            if (widget) {
              restoredWidgets.push(widget);
            }
          });
          
          if (restoredWidgets.length > 0) {
            setWidgets(restoredWidgets);
            return;
          }
        } catch (error) {
          console.error('Error loading saved widgets:', error);
        }
      }
      
      // If no saved widgets or error, use default widgets
      const defaultWidgets: WidgetData[] = [];
      const defaultIds = ['monthly-expenses', 'monthly-incomes', 'monthly-balance'];
      defaultIds.forEach(id => {
        const widget = availableWidgets.find(w => w.id === id);
        if (widget) {
          defaultWidgets.push(widget);
        }
      });
      
      setWidgets(defaultWidgets);
    }
  }, [mounted, monthlyExpenseTotal, monthlyIncome, monthlyBalance, calculatePercentageChange, getAvailableWidgets]);

  const handleAddWidget = (widgetType: string) => {
    const availableWidgets = getAvailableWidgets();
    const widget = availableWidgets.find(w => w.id === widgetType);
    if (widget && !widgets.find(w => w.id === widget.id)) {
      const newWidgets = [...widgets, widget];
      setWidgets(newWidgets);
      onWidgetChange?.(newWidgets);
      
      // Save widget IDs to localStorage
      const widgetIds = newWidgets.map(w => w.id);
      localStorage.setItem('dashboard-widget-ids', JSON.stringify(widgetIds));
    }
    setShowAddWidget(false);
  };

  const handleRemoveWidget = (id: string) => {
    const newWidgets = widgets.filter(w => w.id !== id);
    setWidgets(newWidgets);
    onWidgetChange?.(newWidgets);
    
    // Save widget IDs to localStorage
    const widgetIds = newWidgets.map(w => w.id);
    localStorage.setItem('dashboard-widget-ids', JSON.stringify(widgetIds));
  };

  const handleEditWidget = (id: string) => {
    // Implement widget editing functionality
    console.log('Edit widget:', id);
  };

  const handleSaveLayout = () => {
    setIsEditing(false);
    // Save widget IDs to localStorage
    const widgetIds = widgets.map(w => w.id);
    localStorage.setItem('dashboard-widget-ids', JSON.stringify(widgetIds));
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="p-6 rounded-xl bg-white  ">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-[#15994e] rounded-lg">
            <LuActivity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome to we spend
            </h1>
            <p className="text-sm font-semibold text-gray-600">
              Track your finances and stay on top of your budget
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gray-100 ">
            <div className="flex items-center space-x-2">
              <FaRegCalendar className="w-4 h-4 text-[#15994e]" />
              <span className="text-sm font-medium text-gray-600">Current Month</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div className="p-4 rounded-2xl bg-gray-100 ">
            <div className="flex items-center space-x-2">
              <FaChartColumn className="w-4 h-4 text-blue-700" />
              <span className="text-sm font-medium text-gray-600">Total Entries</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {totalEntries > 0 ? `${totalEntries} entries` : 'No entries yet'}
            </p>
          </div>
          
          <div className="p-4 rounded-2xl bg-gray-100 ">
            <div className="flex items-center space-x-2">
              <FiPieChart className="w-4 h-4 text-purple-700" />
              <span className="text-sm font-medium text-gray-600">Status</span>
            </div>
            <p className={`text-lg font-bold ${getFinancialStatus().color} mt-1`}>
              {getFinancialStatus().status}
            </p>
          </div>
        </div>
      </div>

      {/* Progress and Insights Section */}
      {(monthlyExpenseTotal > 0 || monthlyIncome > 0) && (
        <div className="p-6 rounded-2xl bg-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Monthly Progress
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income vs Expenses Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Income vs Expenses
                </span>
                <span className={`text-sm font-bold ${monthlyBalance >= 0 ? 'text-[#15994e]' : 'text-red-600'}`}>
                  {monthlyBalance >= 0 ? '+' : ''}{monthlyBalance.toFixed(2)} LKR
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    monthlyBalance >= 0 ? 'bg-[#15994e]' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, Math.max(0, (monthlyIncome / (monthlyIncome + monthlyExpenseTotal)) * 100))}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-500">
                  Income: {monthlyIncome.toFixed(2)} LKR
                </span>
                <span className="text-gray-500">
                  Expenses: {monthlyExpenseTotal.toFixed(2)} LKR
                </span>
              </div>
            </div>
            
            {/* Savings Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Savings Rate
                </span>
                <span className={`text-sm font-bold ${calculateSavingsRate() >= 20 ? 'text-[#15994e]' : 'text-yellow-600'}`}>
                  {calculateSavingsRate()}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    calculateSavingsRate() >= 20 ? 'bg-[#15994e]' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min(100, calculateSavingsRate())}%` }}
                ></div>
              </div>
              <div className="text-xs mt-1">
                <span className="text-gray-500">
                  Target: 20% | Current: {calculateSavingsRate()}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-xl font-semibold dashboard-header">Financial Overview</h2>
        
        <div className="flex items-center space-x-2">
          {isEditing && (
            <>
              <button
                onClick={() => setShowAddWidget(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#15994e] hover:bg-[#137a3d] text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Widget</span>
              </button>
              
              <button
                onClick={handleSaveLayout}
                className="flex items-center space-x-2 px-4 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg transition-colors"
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
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Customize'}</span>
          </button>
        </div>
      </div>

      {/* Widgets Grid */}
      {mounted && (
        <>
          {widgets.length > 0 ? (
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
          ) : (
            /* Empty State */
            <div className="p-8 rounded-xl bg-white shadow-lg border border-gray-200 text-center">
              <div className="p-4 bg-emerald-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-[#15994e]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Start Customizing Your Dashboard
              </h3>
              <p className="text-sm mb-6 text-gray-600">
                Click &quot;Customize&quot; to add widgets and personalize your financial overview
              </p>
            </div>
          )}
        </>
      )}

      {/* Quick Actions - Always Visible */}
      <div className="p-6 rounded-2xl bg-gray-100 ">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onAddClick}
            className="p-4 rounded-2xl bg-gray-50  transition-all cursor-pointer hover:border-[#15994e] hover:bg-white text-left w-full"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <HiMiniArrowTrendingDown className="w-5 h-5 text-red-700" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-gray-900">Add Expense</p>
                <p className="text-xs text-gray-600">Track your spending</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>
          
          <button
            onClick={onAddClick}
            className="p-4 rounded-2xl bg-gray-50  transition-all cursor-pointer hover:border-[#15994e] hover:bg-white text-left w-full"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <HiMiniArrowTrendingUp className="w-5 h-5 text-[#15994e]" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-gray-900">Add Income</p>
                <p className="text-xs text-gray-600">Record your earnings</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Tips Section - Always Visible */}
      <div className="p-6 rounded-2xl bg-gray-100 ">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
          <TbBulb className="w-5 h-5 mr-2 text-yellow-400" />
          Financial Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2"></div>
              <p className="text-sm text-gray-600">Add expenses daily to stay on track</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2"></div>
              <p className="text-sm text-gray-600">Categorize your spending for better insights</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2"></div>
              <p className="text-sm text-gray-600">Set monthly budget goals and track progress</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2"></div>
              <p className="text-sm text-gray-600">Review your spending patterns regularly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Widget
              </h3>
              <button
                onClick={() => setShowAddWidget(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {getAvailableWidgets()
                .filter((widget: WidgetData) => !widgets.find(w => w.id === widget.id))
                .map((widget: WidgetData) => (
                  <button
                    key={widget.id}
                    onClick={() => handleAddWidget(widget.id)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${widget.color}`}>
                      {widget.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {widget.title}
                      </div>
                      <div className="text-sm text-gray-500">
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