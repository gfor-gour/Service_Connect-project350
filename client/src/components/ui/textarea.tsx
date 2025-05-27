import * as React from "react"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => {
    const baseClasses =
      "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"

    return <textarea className={`${baseClasses} ${className}`} ref={ref} {...props} />
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
