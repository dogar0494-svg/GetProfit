create or replace function public.submit_withdrawal_atomic(
  p_user_id uuid,
  p_amount numeric,
  p_payment_method text,
  p_account_number text,
  p_fee_amount numeric,
  p_net_amount numeric,
  p_withdrawal_date date
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_current_balance numeric;
  v_withdrawal_id uuid;
  v_payment_method text := nullif(btrim(p_payment_method), '');
  v_account_number text := nullif(btrim(p_account_number), '');
  v_fee_amount numeric;
  v_net_amount numeric;
begin
  if auth.uid() is null or p_user_id is null or auth.uid() <> p_user_id then
    raise exception 'Not authenticated';
  end if;
  if p_amount is null or p_amount <= 0 or p_amount::text in ('NaN', 'Infinity', '-Infinity') then
    raise exception 'Withdrawal amount must be positive.';
  end if;
  if v_payment_method is null or v_payment_method not in ('JazzCash', 'Easypaisa') then
    raise exception 'Select a valid payment method.';
  end if;
  if v_account_number is null then
    raise exception 'Enter your account number.';
  end if;
  select p.wallet_balance into v_current_balance
  from public.profiles p where p.id = p_user_id for update;
  if not found then raise exception 'Profile not found.'; end if;
  if v_current_balance is null or p_amount > v_current_balance then
    raise exception 'Insufficient balance.';
  end if;
  v_fee_amount := 0;
  v_net_amount := p_amount;
  update public.profiles set wallet_balance = wallet_balance - p_amount where id = p_user_id;
  insert into public.transactions (
    user_id, type, amount, original_amount, fee_amount, net_amount,
    withdrawal_date, status, payment_method, account_number, description
  ) values (
    p_user_id, 'withdrawal', p_amount, p_amount, v_fee_amount, v_net_amount,
    current_date, 'pending', v_payment_method, v_account_number, 'Withdrawal request'
  ) returning id into v_withdrawal_id;
  return v_withdrawal_id;
end;
$function$;
revoke all on function public.submit_withdrawal_atomic(uuid, numeric, text, text, numeric, numeric, date) from public, anon;
grant execute on function public.submit_withdrawal_atomic(uuid, numeric, text, text, numeric, numeric, date) to authenticated, service_role;
