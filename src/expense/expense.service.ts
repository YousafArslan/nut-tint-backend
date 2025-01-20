import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseDto, GetExpensesDto } from './expense.dto';
import { validate } from 'class-validator';
import { errorResponse, successResponse } from 'src/response.utils';
import { User } from 'src/user/user.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense) // Inject the TypeORM repository for Expense
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  // Create a new expense
  async createExpense(expenseData: CreateExpenseDto, user: User): Promise<any> {
    try {
      // Validate the incoming expense data
      const errors = await validate(expenseData);
      if (errors.length > 0) {
        const errorMessages = errors.map((error) =>
          Object.values(error.constraints).join(', '),
        );
        return errorResponse(
          `Validation failed: ${errorMessages.join('; ')}`,
          400,
        );
      }
      // Create a new expense
      const expense: any = this.expenseRepository.create({
        ...expenseData,
        createdBy: user,
      });
      await this.expenseRepository.save(expense);

      return successResponse(expense, 'Expense created successfully');
    } catch (error) {
      console.error(error);
      return errorResponse(
        'An unexpected error occurred while creating the expense',
        500,
      );
    }
  }

  // Get all expenses with optional date range filter
  async getAllExpenses(getExpensesDto: GetExpensesDto): Promise<any> {
    try {
      const { startDate, endDate } = getExpensesDto;

      let expenses: any;
      if (startDate && endDate) {
        expenses = await this.expenseRepository.find({
          where: {
            createdAt: Between(startDate, endDate),
          },
          relations: ['createdBy', 'updatedBy'], // Include user relationships
        });
      } else {
        expenses = await this.expenseRepository.find({
          relations: ['createdBy', 'updatedBy'], // Include user relationships
        });
      }

      return successResponse(expenses, 'Expenses fetched successfully');
    } catch (error) {
      console.error(error);
      return errorResponse(
        'An unexpected error occurred while fetching expenses',
        500,
      );
    }
  }

  // Update an existing expense
  async updateExpense(
    id: number,
    updateData: CreateExpenseDto,
    user: User,
  ): Promise<any> {
    try {
      const expense: any = await this.expenseRepository.findOne({
        where: { id },
        relations: ['createdBy', 'updatedBy'], // Include user relationships
      });
      if (!expense) {
        return errorResponse('Expense not found', 404);
      }

      Object.assign(expense, updateData, { updatedBy: user });
      await this.expenseRepository.save(expense);

      return successResponse(expense, 'Expense updated successfully');
    } catch (error) {
      console.error(error);
      return errorResponse(
        'An unexpected error occurred while updating the expense',
        500,
      );
    }
  }

  // Delete an expense
  async deleteExpense(id: number): Promise<any> {
    try {
      const expense = await this.expenseRepository.findOne({
        where: { id },
      });
      if (!expense) {
        return errorResponse('Expense not found', 404);
      }

      await this.expenseRepository.remove(expense);

      return successResponse(null, 'Expense deleted successfully');
    } catch (error) {
      console.error(error);
      return errorResponse(
        'An unexpected error occurred while deleting the expense',
        500,
      );
    }
  }
}
