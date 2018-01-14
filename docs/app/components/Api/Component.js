import React from 'react';

const ApiComponent = () => (
  <section>
    <h1 className="page-title">Component</h1>
    <h3>Props</h3>
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>items</td>
          <td>Array</td>
          <td />
          <td>List of item. Each item in array should have a unique <code>id</code> and the <code>path</code></td>
        </tr>
        <tr>
          <td>itemRenderer</td>
          <td>Component | function</td>
          <td />
          <td>
            A Component or stateless function to render the item. Invoked with the following properties:
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>isDragging</td>
                  <td>boolean</td>
                  <td><code>true</code> if a drag operation is in progress</td>
                </tr>
                <tr>
                  <td>isClosestDragging</td>
                  <td>boolean</td>
                  <td><code>true</code> if a drag operation is in progress at the closet item</td>
                </tr>
                <tr>
                  <td>connectDragSource</td>
                  <td>function</td>
                  <td>
                    See <a href="https://react-dnd.github.io/react-dnd/docs-drag-source-connector.html">React DnD</a>
                  </td>
                </tr>
                <tr>
                  <td>connectDragPreview</td>
                  <td>function</td>
                  <td>
                    See <a href="https://react-dnd.github.io/react-dnd/docs-drag-source-connector.html">React DnD</a>
                  </td>
                </tr>
                <tr>
                  <td>connectDropTarget</td>
                  <td>function</td>
                  <td>
                    See <a href="https://react-dnd.github.io/react-dnd/docs-drop-target-connector.html">React DnD</a>
                  </td>
                </tr>
              </tbody>
            </table>
            And all item properties like <code>id</code>, <code>name</code> etc.
          </td>
        </tr>
        <tr>
          <td>onChange</td>
          <td>function</td>
          <td />
          <td>A function invoked with the new array of items whenever an item is dropped in a new location</td>
        </tr>
        <tr>
          <td>component</td>
          <td>Component | function | string</td>
          <td>div</td>
          <td>A Component, stateless function, or string corresponding to a default JSX element</td>
        </tr>
        <tr>
          <td>threshold</td>
          <td>number</td>
          <td>20</td>
          <td>Distance in pixels the cursor must move horizontally before item changes depth</td>
        </tr>
        <tr>
          <td>maxDepth</td>
          <td>number</td>
          <td>Infinity</td>
          <td>Maximum item depth</td>
        </tr>
        <tr>
          <td>cancelOnDropOutside</td>
          <td>boolean</td>
          <td>false</td>
          <td>Revert the drag operation if the item was dropped outside its container</td>
        </tr>
        <tr>
          <td>onMove</td>
          <td>function</td>
          <td>null</td>
          <td>
            A function invoked whenever an item is dropped in a new location with the following arguments:
            <ul>
              <li>items</li>
              <li>dragIndex</li>
              <li>newIndex</li>
            </ul>
            Returns <code>false</code> to cancel the drag operator
          </td>
        </tr>
        <tr>
          <td>onDragStart</td>
          <td>function</td>
          <td>null</td>
          <td>A function invoked whenever the drag operation has been started</td>
        </tr>
        <tr>
          <td>ondDragEnd</td>
          <td>function</td>
          <td>null</td>
          <td>A function invoked whenever the drag operation has been finished</td>
        </tr>
        <tr>
          <td>onDrop</td>
          <td>function</td>
          <td>null</td>
          <td>A function invoked whenever the drag operation has been dropped</td>
        </tr>
      </tbody>
    </table>
  </section>
);

export default ApiComponent;
