import React, { useState } from 'react';
import { FocusBoardProvider } from '@/contexts/FocusBoardContext';
import { DailyPlannerBoard } from '@/components/DailyPlannerBoard';
import { StatusDashboard } from '@/components/StatusDashboard';
import { TimelineLog } from '@/components/TimelineLog';
import { ExportOptions } from '@/components/ExportOptions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  History,
  Target,
  Zap
} from 'lucide-react';

const Index = () => {
  return (
    <FocusBoardProvider>
      <div className="min-h-screen bg-focus-bg">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">FocusBoard</h1>
                  <p className="text-xs text-muted-foreground">Your productivity command center</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Stay focused, stay productive</span>
                </div>
                <ExportOptions />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <Tabs defaultValue="planner" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[450px] mx-auto">
              <TabsTrigger value="planner" className="gap-2">
                <CheckSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Planner</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Timeline</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="planner" className="space-y-6">
              <DailyPlannerBoard />
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6">
              <StatusDashboard />
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <TimelineLog />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t bg-background/50 mt-16">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Built for developers who value focused productivity
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Made with ❤️ for productivity</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </FocusBoardProvider>
  );
};

export default Index;
