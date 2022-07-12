export class CardReport {
  name: string;
  category: string;
  total: number;
  monthTotal: number;
  currency: string;
  percentage: number;
  perfomance: number;
  lastPerfomance: number;
  isIncreasing: boolean;
}

export class SalesReport {
  incomes: number;
  expenses: number;
  grossProfit: number;
  netProfit: number;
}

export class LineChartReport {
  chartLabel: string[];
  linesData: number[][];
}

export class BarChartReport {
  chartLabel: string[];
  data: number[][];
}

export class PieChartReport {
  value: number;
  name: string;
}

export class Summary {
  title: string;
  value: number;
}


