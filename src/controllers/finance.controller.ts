import { Request, Response } from "express";
import FinanceService from "../services/finance.service";

interface IdParams {
    id: string;
}

class FinanceController {
    async initMonth(req: Request, res: Response) {
        try {
            const { year, month, defaultAmount } = req.body;

            const result = await FinanceService.initMonth(
                Number(year),
                Number(month),
                Number(defaultAmount)
            );

            res.status(201).json({
                message: "Initialize month successfully.",
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    }

    async getContributions(req: Request, res: Response) {
        try {
            const { year, month } = req.query;

            const result = await FinanceService.getContributions(
                Number(year),
                Number(month)
            );

            res.json(result);
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    }

    async payContribution(req: Request<IdParams>, res: Response) {
        try {
            const { id } = req.params;
            const { amount, paidAt, note } = req.body;

            const result = await FinanceService.payContribution(
                id,
                Number(amount),
                paidAt ? new Date(paidAt) : undefined,
                note
            );

            res.json({
                message: "Contribution updated successfully.",
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    }

    async unpayContribution(req: Request<IdParams>, res: Response) {
        try {
            const { id } = req.params;

            const result = await FinanceService.unpayContribution(id);

            res.json({
                message: "Contribution updated successfully.",
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    }

    async excuseContribution(req: Request<IdParams>, res: Response) {
        try {
            const { id } = req.params;
            const { note } = req.body;

            const result = await FinanceService.excuseContribution(
                id,
                note
            );

            res.json({
                message: "Contribution updated successfully.",
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    }

    async getTransactions(req: Request, res: Response) {
        try {
            const { year, month, type } = req.query;

            const result = await FinanceService.getTransactions({
                year: year ? Number(year) : undefined,
                month: month ? Number(month) : undefined,
                type: type as any,
            });

            res.json(result);
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    }

    async createExpense(req: Request, res: Response) {
        try {
            const result = await FinanceService.createExpense({
                category: req.body.category,
                amount: Number(req.body.amount),
                description: req.body.description,
                transactionDate: new Date(req.body.transactionDate),
            });

            res.status(201).json({
                message: "Expense created successfully.",
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    }

    async updateExpense(req: Request<IdParams>, res: Response) {
        try {
            const { id } = req.params;

            const body: any = {};

            if (req.body.category) body.category = req.body.category;
            if (req.body.amount !== undefined)
                body.amount = Number(req.body.amount);
            if (req.body.description !== undefined)
                body.description = req.body.description;
            if (req.body.transactionDate)
                body.transactionDate = new Date(req.body.transactionDate);

            const result = await FinanceService.updateExpense(
                id,
                body
            );

            res.json({
                message: "Expense updated successfully.",
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    }

    async deleteExpense(req: Request<IdParams>, res: Response) {
        try {
            const { id } = req.params;

            await FinanceService.deleteExpense(id);

            res.json({
                message: "Expense deleted successfully.",
            });
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    }

    async getSummary(req: Request, res: Response) {
        try {
            const { year, month } = req.query;

            const result = await FinanceService.getSummary(
                Number(year),
                month ? Number(month) : undefined
            );

            res.json(result);
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
}

export default new FinanceController();