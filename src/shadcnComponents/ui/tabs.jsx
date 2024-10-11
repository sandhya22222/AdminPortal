import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

const Tabs = ({
    defaultActiveKey,
    activeKey,
    onTabClick,
    orientation = 'horizontal',
    type = 'line',
    children,
    className,
    ...props
}) => (
    <TabsPrimitive.Root
        value={activeKey || defaultActiveKey}
        onValueChange={onTabClick}
        orientation={orientation}
        className={cn(orientation === 'vertical' ? 'flex' : 'flex-col', className)}
        {...props}>
        {children}
    </TabsPrimitive.Root>
)

const TabsList = React.forwardRef(({ className, orientation = 'horizontal', type = 'line', ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            'inline-flex items-r  pt-2.5 text-muted-foreground',
            orientation === 'vertical' ? 'flex-col w-48' : 'flex-row',
            className
        )}
        {...props}
    />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, borderPosition = 'bottom', ...props }, ref) => {
    const borderClass = {
        bottom: 'border-b border-brandGray2 data-[state=active]:border-b-2 data-[state=active]:border-brandPrimaryColor',
        right: 'border-r border-brandGray2 data-[state=active]:border-r-2 data-[state=active]:border-brandPrimaryColor',
    }

    return (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(
                'relative inline-flex items-center whitespace-nowrap h-12 px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
                borderClass[borderPosition],
                'text-brandGray2 data-[state=active]:text-brandPrimaryColor',
                className
            )}
            {...props}
        />
    )
})

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn('mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
        {...props}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
