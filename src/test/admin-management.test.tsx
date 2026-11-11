import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RecordManager } from '@/components/admin/Management';
afterEach(()=>cleanup());
describe('Admin record management',()=>{
 it('does not write edits until saved and passes the record identity',async()=>{
  const save=vi.fn().mockResolvedValue(undefined);
  render(<RecordManager title="नोंदी" rows={[{id:'record-1',name:'जुने नाव'}]} fields={[{key:'name',label:'नाव'}]} save={save} />);
  fireEvent.click(screen.getByRole('button',{name:'संपादन'}));
  fireEvent.change(screen.getByLabelText('नाव'),{target:{value:'नवे नाव'}});
  expect(save).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:'जतन करा'}));
  await waitFor(()=>expect(save).toHaveBeenCalledWith({name:'नवे नाव'},'record-1'));
 });
 it('requires confirmation before deleting a record',async()=>{
  const remove=vi.fn().mockResolvedValue(undefined);
  const confirmation=vi.spyOn(window,'confirm').mockReturnValue(false);
  render(<RecordManager title="नोंदी" rows={[{id:'record-2',name:'बातमी'}]} fields={[{key:'name',label:'नाव'}]} save={vi.fn()} remove={remove} />);
  fireEvent.click(screen.getByRole('button',{name:'हटवा'}));
  expect(remove).not.toHaveBeenCalled();
  confirmation.mockReturnValue(true);
  fireEvent.click(screen.getByRole('button',{name:'हटवा'}));
  await waitFor(()=>expect(remove).toHaveBeenCalledWith('record-2'));
  confirmation.mockRestore();
 });
});