import type { Debt,DebtType } from '../types/models'
const fixedTypes=new Set<DebtType>(['personal_loan','bank_loan','fintech_loan','mortgage'])
const informalTypes=new Set<DebtType>(['family','friend'])
export type DebtBehavior='revolving'|'fixed_installment'|'agreed_plan'|'informal'
export function debtBehavior(debt:Debt):DebtBehavior{if(debt.type==='credit_card')return'revolving';if(fixedTypes.has(debt.type))return'fixed_installment';if(informalTypes.has(debt.type))return'informal';return'agreed_plan'}
export function monthlyObligation(debt:Debt):number{if(debt.status==='paid'||!Number.isFinite(debt.balance)||debt.balance<=0||(debt.installmentAmount!==undefined&&debt.remainingInstallments===0))return 0;const configured=Math.max(0,debt.installmentAmount??0,debt.agreedPayment??0,debt.minimumPayment??0);return Math.min(debt.balance,configured)}
export const mandatoryPayment=monthlyObligation
export function allowsExtraPayment(debt:Debt):boolean{if(debt.canPrepay==='no')return false;const behavior=debtBehavior(debt);if(behavior==='revolving'||behavior==='informal')return true;if(!debt.installmentAmount&&!debt.remainingInstallments)return true;return debt.canPrepay==='yes'}
export function installmentWarning(debt:Debt):string|undefined{if(!debt.installmentAmount||!debt.remainingInstallments)return undefined;const scheduled=debt.installmentAmount*debt.remainingInstallments;if(debt.balance>0&&Math.abs(scheduled-debt.balance)/debt.balance>.1)return'El saldo y el total de cuotas no coinciden. Conservamos ambos datos y no asumimos que uno reemplaza al otro.'}
