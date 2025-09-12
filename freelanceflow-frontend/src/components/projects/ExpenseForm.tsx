import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Expense } from "@/store/projectStore";

import { expenseFormSchema } from "./expense-form-schema";

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  onSubmit: (values: ExpenseFormValues) => void;
  initialData?: Expense;
}

const ExpenseForm = ({ onSubmit, initialData }: ExpenseFormProps) => {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: initialData || { description: "", amount: 0, date: new Date().toISOString().split('T')[0] } as ExpenseFormValues,
  });

  const _onSubmit = form.handleSubmit(onSubmit);

  return (
    <Form onSubmit={_onSubmit} className="space-y-4">
        <FormField<ExpenseFormValues>
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Description</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Office supplies" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField<ExpenseFormValues>
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField<ExpenseFormValues>
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Expense</Button>
    </Form>
  );
};

export default ExpenseForm;
