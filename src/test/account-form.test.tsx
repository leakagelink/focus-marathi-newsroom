import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,describe,it,expect,vi} from 'vitest';
import {AccountForm} from '@/components/AccountForm';
const auth=vi.hoisted(()=>({signInWithOtp:vi.fn(),verifyOtp:vi.fn(),signUp:vi.fn(),signInWithPassword:vi.fn()}));
vi.mock('@/integrations/supabase/client',()=>({supabase:{auth}}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
describe('Email and phone accounts',()=>{
 it('does not create an account during phone login and verifies the sent number',async()=>{
  auth.signInWithOtp.mockResolvedValue({error:null});auth.verifyOtp.mockResolvedValue({error:null});
  render(<AccountForm />);fireEvent.click(screen.getByRole('button',{name:'मोबाईल'}));
  fireEvent.change(screen.getByLabelText('मोबाईल क्रमांक'),{target:{value:'9876543210'}});
  fireEvent.click(screen.getByRole('button',{name:'OTP पाठवा'}));
  await waitFor(()=>expect(auth.signInWithOtp).toHaveBeenCalledWith({phone:'+919876543210',options:{shouldCreateUser:false}}));
  fireEvent.change(await screen.findByLabelText('OTP'),{target:{value:'123456'}});fireEvent.click(screen.getByRole('button',{name:'OTP सत्यापित करा'}));
  await waitFor(()=>expect(auth.verifyOtp).toHaveBeenCalledWith({phone:'+919876543210',token:'123456',type:'sms'}));
 });
 it('creates phone signup with the journalist name',async()=>{
  auth.signInWithOtp.mockResolvedValue({error:null});render(<AccountForm />);
  fireEvent.click(screen.getByRole('button',{name:'मोबाईल'}));fireEvent.click(screen.getByRole('button',{name:'नवीन खाते तयार करा'}));
  fireEvent.change(screen.getByLabelText('नाव'),{target:{value:'पत्रकार'}});fireEvent.change(screen.getByLabelText('मोबाईल क्रमांक'),{target:{value:'9876543210'}});
  fireEvent.click(screen.getByRole('button',{name:'OTP पाठवा'}));
  await waitFor(()=>expect(auth.signInWithOtp).toHaveBeenCalledWith({phone:'+919876543210',options:{shouldCreateUser:true,data:{name:'पत्रकार'}}}));
 });
 it('shows a service-unavailable result without pretending OTP was sent',async()=>{
  auth.signInWithOtp.mockResolvedValue({error:{message:'Phone provider disabled'}});render(<AccountForm />);
  fireEvent.click(screen.getByRole('button',{name:'मोबाईल'}));fireEvent.change(screen.getByLabelText('मोबाईल क्रमांक'),{target:{value:'9876543210'}});fireEvent.click(screen.getByRole('button',{name:'OTP पाठवा'}));
  await waitFor(()=>expect(auth.signInWithOtp).toHaveBeenCalledOnce());
  expect(await screen.findByRole('status')).toHaveTextContent('मोबाईल OTP सेवा अजून सुरू नाही');
  expect(auth.verifyOtp).not.toHaveBeenCalled();
 });
});