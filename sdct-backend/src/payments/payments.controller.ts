import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('payments')
export class PaymentsController {
  @Get('status')
  status() {
    return { status: 'ok' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('donate/stripe')
  async donateStripe(@Req() req: any) {
    // In real integration, create Stripe Checkout Session here
    return {
      provider: 'stripe',
      url: process.env.STRIPE_DONATE_URL || 'https://example.com/stripe-checkout',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('donate/paypal')
  async donatePaypal(@Req() req: any) {
    // In real integration, create PayPal order here
    return {
      provider: 'paypal',
      url: process.env.PAYPAL_DONATE_URL || 'https://example.com/paypal-checkout',
    };
  }
}