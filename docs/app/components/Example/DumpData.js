import React from 'react';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';

import { buildTree, flatten } from 'react-sortly';

const DumpData = ({ items, raw, tree, flat }) => (
  <div className="row">
    {raw &&
      <div className="col">
        <ReactJson name="Raw = Tree.state.items" src={items} displayObjectSize={false} displayDataTypes={false} />
      </div>
    }
    {tree &&
      <div className="col">
        <ReactJson
          name="Tree = buildTree(Raw)"
          src={buildTree(items)}
          displayObjectSize={false}
          displayDataTypes={false}
        />
      </div>
    }
    {flat &&
      <div className="col">
        <ReactJson name="Flat = flatten(Raw)" src={flatten(items)} displayObjectSize={false} displayDataTypes={false} />
      </div>
    }
  </div>
);

DumpData.propTypes = {
  items: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  raw: PropTypes.bool,
  tree: PropTypes.bool,
  flat: PropTypes.bool,
};

DumpData.defaultProps = {
  raw: true,
  tree: true,
  flat: true,
};

export default DumpData;
