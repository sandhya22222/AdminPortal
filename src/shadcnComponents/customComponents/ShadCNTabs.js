import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

const ShadCNTabs = ({
    defaultActiveKey,
    activeKey,
    onTabClick,
    orientation = 'horizontal',
    borderPosition = 'bottom',
    className,
    children,
    direction = 'ltr',
    ...props
}) => {
    const borderClass = {
        bottom: 'border-b border-brandGray2 data-[state=active]:border-b-2 data-[state=active]:border-brandPrimaryColor',
        right: 'border-r border-brandGray2 data-[state=active]:border-r-2 data-[state=active]:border-brandPrimaryColor',
    }

    return (
        <TabsPrimitive.Root
            value={activeKey || defaultActiveKey}
            onValueChange={onTabClick}
            orientation={orientation}
            className={cn(
                orientation === 'vertical' ? 'flex' : 'flex-col',
                direction === 'rtl' ? 'rtl' : 'ltr',
                className
            )}
            dir={direction}
            {...props}>
            <TabsPrimitive.List
                className={cn(
                    'inline-flex items-center pt-2.5 text-muted-foreground',
                    orientation === 'vertical' ? 'flex-col w-48' : 'flex-row',
                    className
                )}>
                {children.map((child, index) => React.cloneElement(child, { key: index, borderPosition }))}
            </TabsPrimitive.List>
        </TabsPrimitive.Root>
    )
}

const ShadCNTabsTrigger = React.forwardRef(({ className, borderPosition = 'bottom', ...props }, ref) => {
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
ShadCNTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const ShadCNTabsContent = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn('mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
        {...props}
    />
))
ShadCNTabsContent.displayName = TabsPrimitive.Content.displayName

export { ShadCNTabs, ShadCNTabsTrigger, ShadCNTabsContent }
