import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group bg-card text-foreground border border-border shadow-soft rounded-md font-sans",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-secondary text-secondary-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
