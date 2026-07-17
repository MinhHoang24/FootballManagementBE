import MonthlyContribution, {
    ContributionStatus,
} from "../models/monthlyContribution.model";
import FinanceTransaction, {
    TransactionCategory,
    TransactionType,
} from "../models/financeTransaction.model";
import Player from "../models/player.model";

class FinanceService {
    /**
     * Khởi tạo danh sách đóng quỹ cho 1 tháng
     */
    async initMonth(
        year: number,
        month: number,
        defaultAmount: number
    ) {
        const existed = await MonthlyContribution.exists({
            year,
            month,
        });

        if (existed) {
            throw new Error("Month already initialized.");
        }

        const players = await Player.find().select("_id");

        const docs = players.map((player) => ({
            year,
            month,
            playerId: player._id,
            amount: defaultAmount,
            status: ContributionStatus.UNPAID,
        }));

        return MonthlyContribution.insertMany(docs);
    }

    /**
     * Danh sách đóng quỹ
     */
    async getContributions(year: number, month: number) {
        return MonthlyContribution.find({
            year,
            month,
        })
            .populate("playerId")
            .sort({
                "playerId.number": 1,
            });
    }

    /**
     * Đánh dấu đã đóng
     */
    async payContribution(
        id: string,
        amount: number,
        paidAt?: Date,
        note?: string
    ) {
        const contribution = await MonthlyContribution.findById(id);

        if (!contribution) {
            throw new Error("Contribution not found.");
        }

        contribution.amount = amount;
        contribution.status = ContributionStatus.PAID;
        contribution.note = note ?? "";
        contribution.paidAt = paidAt ?? new Date();

        await contribution.save();

        const existed = await FinanceTransaction.findOne({
            contributionId: contribution._id,
        });

        if (existed) {
            existed.amount = amount;
            existed.transactionDate = contribution.paidAt;

            await existed.save();

            return contribution;
        }

        await FinanceTransaction.create({
            type: TransactionType.INCOME,

            category: TransactionCategory.MONTHLY_FEE,

            amount,

            description: `Monthly contribution ${contribution.month}/${contribution.year}`,

            transactionDate: contribution.paidAt,

            contributionId: contribution._id,
        });

        return contribution;
    }

    /**
     * Hủy đóng
     */
    async unpayContribution(id: string) {
        const contribution = await MonthlyContribution.findById(id);

        if (!contribution) {
            throw new Error("Contribution not found.");
        }

        contribution.status = ContributionStatus.UNPAID;
        contribution.paidAt = undefined;

        await contribution.save();

        await FinanceTransaction.deleteOne({
            contributionId: contribution._id,
        });

        return contribution;
    }

    /**
     * Nghỉ không đóng
     */
    async excuseContribution(
        id: string,
        note?: string
    ) {
        const contribution = await MonthlyContribution.findById(id);

        if (!contribution) {
            throw new Error("Contribution not found.");
        }

        contribution.status = ContributionStatus.EXCUSED;
        contribution.note = note ?? "";
        contribution.paidAt = undefined;

        await contribution.save();

        await FinanceTransaction.deleteOne({
            contributionId: contribution._id,
        });

        return contribution;
    }

    /**
     * Danh sách giao dịch
     */
    async getTransactions(filters: {
        year?: number;
        month?: number;
        type?: TransactionType;
    }) {
        const query: any = {};

        if (filters.type) {
            query.type = filters.type;
        }

        if (filters.year || filters.month) {
            const from = new Date(
                filters.year ?? new Date().getFullYear(),
                (filters.month ?? 1) - 1,
                1
            );

            const to = new Date(from);

            if (filters.month) {
                to.setMonth(to.getMonth() + 1);
            } else {
                to.setFullYear(to.getFullYear() + 1);
            }

            query.transactionDate = {
                $gte: from,
                $lt: to,
            };
        }

        return FinanceTransaction.find(query).sort({
            transactionDate: -1,
        });
    }

    /**
     * Thêm khoản chi
     */
    async createExpense(body: {
        category: TransactionCategory;
        amount: number;
        description: string;
        transactionDate: Date;
    }) {
        return FinanceTransaction.create({
            type: TransactionType.EXPENSE,
            ...body,
        });
    }

    /**
     * Cập nhật khoản chi
     */
    async updateExpense(
        id: string,
        body: Partial<{
            category: TransactionCategory;
            amount: number;
            description: string;
            transactionDate: Date;
        }>
    ) {
        return FinanceTransaction.findByIdAndUpdate(
            id,
            body,
            {
                new: true,
            }
        );
    }

    /**
     * Xóa khoản chi
     */
    async deleteExpense(id: string) {
        return FinanceTransaction.findByIdAndDelete(id);
    }

    /**
     * Tổng kết
     */
    async getSummary(year: number, month?: number) {
        const from = new Date(
            year,
            month ? month - 1 : 0,
            1
        );

        const to = new Date(from);

        if (month) {
            to.setMonth(to.getMonth() + 1);
        } else {
            to.setFullYear(to.getFullYear() + 1);
        }

        const transactions =
            await FinanceTransaction.find({
                transactionDate: {
                    $gte: from,
                    $lt: to,
                },
            });

        const income = transactions
            .filter((i) => i.type === TransactionType.INCOME)
            .reduce((sum, i) => sum + i.amount, 0);

        const expense = transactions
            .filter((i) => i.type === TransactionType.EXPENSE)
            .reduce((sum, i) => sum + i.amount, 0);

        const contributions =
            await MonthlyContribution.find({
                year,
                ...(month ? { month } : {}),
            });

        return {
            income,
            expense,
            balance: income - expense,

            paidPlayers: contributions.filter(
                (i) => i.status === ContributionStatus.PAID
            ).length,

            unpaidPlayers: contributions.filter(
                (i) => i.status === ContributionStatus.UNPAID
            ).length,

            excusedPlayers: contributions.filter(
                (i) => i.status === ContributionStatus.EXCUSED
            ).length,
        };
    }
}

export default new FinanceService();