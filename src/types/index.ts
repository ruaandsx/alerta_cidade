export interface User { id: number; name: string; email: string; city?: string; }
export interface Category { id: number; name: string; responsible: string; }
export interface Report { id: number; title: string; description: string; status: string; user: User; category: Category; createdAt: string; }
export type RootStackParamList = { Feed: undefined; ReportDetail: { reportId: number }; NewReport: undefined; Map: undefined; Profile: undefined; };
