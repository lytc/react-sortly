import React from 'react';

const examples = {
  convert: `
import { convert } from 'react-sortly';

const rawItems = [
  { id: 1, parentId: null, index: 0, name: 'Category 1' },
  { id: 2, parentId: null, index: 1, name: 'Category 2' },
  { id: 4, parentId: 1, index: 1, name: 'Item 1' },
  { id: 5, parentId: 1, index: 0, name: 'Item 2' },
];

const items = convert(rawItems);
/*
items = [
  { id: 1, name: 'Category 1', path: [] },
  { id: 5, name: 'Item 2', path: [1] },
  { id: 4, name: 'Item 1', path: [1] },
  { id: 2, name: 'Category 2', path: [] },
];
*/
`,
  buildTree: `
import { buildTree } from 'react-sortly';

const items = [
  { id: 1, name: 'Category 1', path: [] },
  { id: 5, name: 'Item 2', path: [1] },
  { id: 4, name: 'Item 1', path: [1] },
  { id: 2, name: 'Category 2', path: [] },
];

const tree = buildTree(items);
/*
tree = [
  { id: 1, name: 'Category 1', children: [
    { id: 5, name: 'Item 2', children: [] },
    { id: 4, name: 'Item 1', children: [] },
  ] },
  { id: 2, name: 'Category 2', children: [] },
];
*/
`,
  flatten: `
import { flatten } from 'react-sortly';

const items = items = [
  { id: 1, name: 'Category 1', path: [] },
  { id: 5, name: 'Item 2', path: [1] },
  { id: 4, name: 'Item 1', path: [1] },
  { id: 2, name: 'Category 2', path: [] },
];

const rawItems = flatten(items);
/*
rawItems = [
  { id: 1, parentId: null, index: 0, name: 'Category 1' },
  { id: 2, parentId: null, index: 1, name: 'Category 2' },
  { id: 4, parentId: 1, index: 1, name: 'Item 1' },
  { id: 5, parentId: 1, index: 0, name: 'Item 2' },
];
*/ 
`,
  findDescendants: `
import { findDescendants } from 'react-sortly';

const items = [
  { id: 1, name: 'Category 1', path: [] },
  { id: 2, name: 'Item 1', path: [1] },
  { id: 3, name: 'Item 2', path: [1] },
  { id: 4, name: 'Item 3', path: [1, 3] },
];

const descendants = findDescendants(items, 1);
/*
descendants = [
  { id: 2, name: 'Item 1', path: [1] },
  { id: 3, name: 'Item 1', path: [1] },
  { id: 4, name: 'Item 3', path: [1, 3] },
];
*/ 
`,
  add: `
import { add } from 'react-sortly';
const items = [
  { id: 1, name: 'Foo', path: [] },
];
const newItems = add(items, { id: 2, name: 'Bar' });
/*
newItems = [
  { id: 1, name: 'Foo', path: [] },
  { id: 2, name: 'Bar', path: [] },
];
*/
`,
  insert: `
import { insert } from 'react-sortly';
const items = [
  { id: 1, name: 'Parent 1', path: [] },
  { id: 2, name: 'Parent 2', path: [] },
  { id: 3, name: 'Item 1', path: [2] },
  { id: 4, name: 'Item 2', path: [2] },
];
const newItems = insert(items, { id: 5, name: 'Item 3' }, 2);
/*
newItems = [
  { id: 1, name: 'Parent 1', path: [] },
  { id: 2, name: 'Parent 2', path: [] },
  { id: 5, name: 'Item 3', path: [2] },
  { id: 3, name: 'Item 1', path: [2] },
  { id: 4, name: 'Item 2', path: [2] },
];
*/
`,
  remove: `
import { remove } from 'react-sortly';
const items = [
  { id: 1, name: 'Parent 1', path: [] },
  { id: 2, name: 'Parent 2', path: [] },
  { id: 3, name: 'Item 1', path: [2] },
  { id: 4, name: 'Item 2', path: [2] },
];
const newItems = remove(items, 1);
/*
newItems = [
  { id: 1, name: 'Parent 1', path: [] },
];
*/
`,
};

const ApiUtils = () => (
  <section>
    <h1 className="page-title">Utils</h1>
    <section>
      <h3 name="convert">convert (items: Array): Array</h3>
      <p>Convert the raw data (e.g. the data from database) to the Sortly data.</p>
      Example:<br />
      <pre className="js" ref={el => el && hljs.highlightBlock(el)}>{examples.convert}</pre>
    </section>
    <section>
      <h3>buildTree (items: Array): Array</h3>
      <p>Convert the Sortly data to the tree struct.</p>
      Example:<br />
      <pre className="js" ref={el => el && hljs.highlightBlock(el)}>{examples.buildTree}</pre>
    </section>
    <section>
      <h3>
        flatten (items: Array, parentIdPropName: string = &apos;parentId&apos;,
        indexPropName: string = &apos;index&apos;): Array
      </h3>
      <p>Convert the Sortly data to the raw data to store into database.</p>
      Example: <br />
      <pre className="js" ref={el => el && hljs.highlightBlock(el)}>{examples.flatten}</pre>
    </section>
    <section>
      <h3>findDescendants(items: Array, index: number): Array</h3>
      <p>Find item descendants</p>
      Example:<br />
      <pre className="js" ref={el => el && hljs.highlightBlock(el)}>{examples.findDescendants}</pre>
    </section>
    <section>
      <h3>add(items: Array, itemData: &#123; id: number|string &#125;): Array</h3>
      <p>Add a new item to the bottom of the list</p>
      Example:<br />
      <pre className="js" ref={el => el && hljs.highlightBlock(el)}>{examples.add}</pre>
    </section>
    <section>
      <h3>insert(items: Array, index: number, itemData: &#123; id: number|string &#125;): Array</h3>
      <p>Insert a new item to the list</p>
      Example:<br />
      <pre className="js" ref={el => el && hljs.highlightBlock(el)}>{examples.insert}</pre>
    </section>
    <section>
      <h3>remove(items: Array, index: number): Array</h3>
      <p>Remove an item and it descendants from the list</p>
      Example:<br />
      <pre className="js" ref={el => el && hljs.highlightBlock(el)}>{examples.remove}</pre>
    </section>
  </section>
);

export default ApiUtils;
