# The Great Table

A simple reusable table component built in React and Tailwind, that provides the following basic table functions: 

- Pagination
- Sorting
- Searching
- Selectable Rows

View a live version [here](https://the-great-table.vercel.app/)!

## Example app setup

- Clone the repo
- Install dependencies with `yarn`
- Run `yarn dev` to start the app

Example app uses data from [Dummy Json](https://dummyjson.com/) stored locally. Loading of data is delayed by 1.5 seconds to demonstrate table loading state.

## Usage

The Table component accepts the following props:

### columns: TableColumn\<RecordType>[]
Array of table column objects to be displayed. Requires type of records displayed in the table to be passed as a type argument

```js
// TableColumn type
{
  title: string; // Column header title to display
  dataIndex: string; // Data object key for this column. At the moment does not support nested objects or arrays
  searchable: boolean; // Search bar will search through all columns set to true
  sort?: boolean; // Optional. If true, header will be clickable to sort the column, alternating between ascending, descending and unsorted, in that order 
}
```
### data: Object\<RecordType>
Array of data to be displayed in the table. Must be of same type as passed to TableColumn

If data is undefined, table will display loading state.

### rowKey: string
Unique field property name of each data record

### selectRows: Fn(RecordType[])
Optional. Function to handle selected rows in parent component. Must accept one argument, array of same type as that passed to TableColumn

## Unsupported / Future Features
- Custom rendering of table data to transform data or other functions (eg. add $ in front of prices, buttons, etc) within each row
- Custom sort functions
- Filtering for range of values (eg. price range, etc)
