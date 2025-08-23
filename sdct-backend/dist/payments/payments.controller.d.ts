export declare class PaymentsController {
    status(): {
        status: string;
    };
    donateStripe(req: any): Promise<{
        provider: string;
        url: string;
    }>;
    donatePaypal(req: any): Promise<{
        provider: string;
        url: string;
    }>;
}
