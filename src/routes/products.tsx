import Table from '../components/Table/Table.tsx';
import { useEffect, useState } from 'react';
import { ProductDetails } from '../models/TableData.ts';
import { TableColumn } from '../models/Table.ts';

export default function Products() {
  const [products, setProducts] = useState<ProductDetails[] | undefined>(undefined);
  const [selectedRows, setSelectedRows] = useState<ProductDetails[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setTimeout(async () => {
        const productRes = await fetch('products.json').then(
          (res) => res.json() as Promise<{ products: ProductDetails[] }>
        );
        setProducts(productRes.products);
      }, 1500);
    };
    fetchProducts();
  }, []);

  const productColumns: TableColumn<ProductDetails>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      searchable: true,
      sort: true
    },
    {
      title: 'Description',
      dataIndex: 'description',
      searchable: false
    },
    {
      title: 'Price',
      dataIndex: 'price',
      searchable: true,
      sort: true
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      searchable: false
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      searchable: false
    }
  ];

  return (
    <div>
      <Table columns={productColumns} data={products} rowKey="id" selectRows={setSelectedRows} />
      <div className="max-w-full overflow-scroll">
        {selectedRows && selectedRows.map((row) => <pre className='whitespace-pre-line' key={row.id}>{JSON.stringify(row, null, 4)}</pre>)}
      </div>
    </div>
  );
}
