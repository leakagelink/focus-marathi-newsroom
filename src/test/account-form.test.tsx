import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,describe,it,expect,vi} from 'vitest';
import {AccountForm} from '@/components/AccountForm';
const auth=vi.hoisted(()=>({setSession:vi.fn(),signUp:vi.fn(),signInWithPassword:vi.fn()}));
const otp=vi.hoisted(()=>({sendPhoneOtp:vi.fn(),verifyPhoneOtp:vi.fn()}));
vi.mock('@/integrations/supabase/client',()=>({supabase:{auth}}));
vi.mock('@/lib/phone-otp.functions',()=>otp);
afterEach(()=>{cleanup();vi.resetAllMocks();});
describe('Email and phone accounts',()=>{
 it('logs in by phone without creating an account and verifies the sent number',async()=>{
  otp.sendPhoneOtp.mockResolvedValue({ok:true});otp.verifyPhoneOtp.mockResolvedValue({ok:true,access_token:'a',refresh_token:'r'});auth.setSession.mockResolvedValue({error:null});
  render(<AccountForm />);fireEvent.click(screen.getByRole('button',{name:'मोबाईल'}));
  fireEvent.change(screen.getByLabelText('मोबाईल क्रमांक'),{target:{value:'9876543210'}});
  fireEvent.click(screen.getByRole('button',{name:'OTP पाठवा'}));
  await waitFor(()=>expect(otp.sendPhoneOtp).toHaveBeenCalledWith({data:{phone:'+919876543210',signup:false}}));
  fireEvent.change(await screen.findByLabelText('OTP'),{target:{value:'123456'}});fireEvent.click(screen.getByRole('button',{name:'OTP सत्यापित करा'}));
  await waitFor(()=>expect(otp.verifyPhoneOtp).toHaveBeenCalledWith({data:{phone:'+919876543210',code:'123456',signup:false,name:''}}));
  await waitFor(()=>expect(auth.setSession).toHaveBeenCalledWith({access_token:'a',refresh_token:'r'}));
 });
 it('phone signup sends signup flag and carries the name on verify',async()=>{
  otp.sendPhoneOtp.mockResolvedValue({ok:true});otp.verifyPhoneOtp.mockResolvedValue({ok:false,error:'x'});render(<AccountForm />);
  fireEvent.click(screen.getByRole('button',{name:'मोबाईल'}));fireEvent.click(screen.getByRole('button',{name:'नवीन खाते तयार करा'}));
  fireEvent.change(screen.getByLabelText('नाव'),{target:{value:'पत्रकार'}});fireEvent.change(screen.getByLabelText('मोबाईल क्रमांक'),{target:{value:'9876543210'}});
  fireEvent.click(screen.getByRole('button',{name:'OTP पाठवा'}));
  await waitFor(()=>expect(otp.sendPhoneOtp).toHaveBeenCalledWith({data:{phone:'+919876543210',signup:true}}));
  fireEvent.change(await screen.findByLabelText('OTP'),{target:{value:'123456'}});fireEvent.click(screen.getByRole('button',{name:'OTP सत्यापित करा'}));
  await waitFor(()=>expect(otp.verifyPhoneOtp).toHaveBeenCalledWith({data:{phone:'+919876543210',code:'123456',signup:true,name:'पत्रकार'}}));
  expect(auth.setSession).not.toHaveBeenCalled();
 });
 it('shows the send error without pretending OTP was sent',async()=>{
  otp.sendPhoneOtp.mockResolvedValue({ok:false,error:'मोबाईल OTP सेवा अजून सुरू नाही.'});render(<AccountForm />);
  fireEvent.click(screen.getByRole('button',{name:'मोबाईल'}));fireEvent.change(screen.getByLabelText('मोबाईल क्रमांक'),{target:{value:'9876543210'}});fireEvent.click(screen.getByRole('button',{name:'OTP पाठवा'}));
  expect(await screen.findByRole('status')).toHaveTextContent('मोबाईल OTP सेवा अजून सुरू नाही');
  expect(screen.queryByLabelText('OTP')).toBeNull();
 });
});
