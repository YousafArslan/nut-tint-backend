import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateExpenseDto, GetExpensesDto } from './expense.dto';

@ApiTags('Expenses') // Optional, but helpful for Swagger documentation
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  // Create a new expense
  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.createExpense(createExpenseDto);
  }

  // Get all expenses (optionally filtered by date)
  @Post('getAll')
  async getAll(@Body() getExpensesDto: GetExpensesDto) {
    return this.expenseService.getAllExpenses(getExpensesDto);
  }

  // Edit an expense (by id)
  @Put(':id')
  async update(@Param('id') id: number, @Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.updateExpense(id, createExpenseDto);
  }

  // Delete an expense (by id)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.expenseService.deleteExpense(id);
  }
}
