import { Toast, toast } from 'sonner';

export function useToast() {
  return {
    toast: (props: Toast) => {
      toast(props.title, {
        description: props.description,
        duration: 4000,
        ...props,
      });
    },
  };
}