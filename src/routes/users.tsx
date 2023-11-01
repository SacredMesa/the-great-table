import Table from '../components/Table/Table.tsx';
import { useEffect, useState } from 'react';
import { UserDetails } from '../models/TableData.ts';
import { TableColumn } from '../models/Table.ts';

export default function Users() {
  const [users, setUsers] = useState<UserDetails[] | undefined>(undefined);
  const [selectedRows, setSelectedRows] = useState<UserDetails[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setTimeout(async () => {
        const usersRes = await fetch('users.json').then(
          (res) =>
            res.json() as Promise<{
              users: UserDetails[];
            }>
        );
        setUsers(usersRes.users);
      }, 1500);
    };
    fetchUsers();
  }, []);

  const userColumns: TableColumn<UserDetails>[] = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      searchable: true,
      sort: true
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      searchable: true
    },
    {
      title: 'Age',
      dataIndex: 'age',
      searchable: false
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      searchable: false
    },
    {
      title: 'Email',
      dataIndex: 'email',
      searchable: false
    }
  ];

  return (
    <>
      <Table columns={userColumns} data={users} rowKey='id' selectRows={setSelectedRows}/>
      <div className="max-w-full overflow-scroll">
        {selectedRows && selectedRows.map((row) => <pre className='whitespace-pre-line' key={row.id}>{JSON.stringify(row, null, 4)}</pre>)}
      </div>
    </>
  );
}
