import React from 'react';
import { Flipper } from 'react-flip-toolkit';
import { Box, Typography } from '@material-ui/core';
import faker from 'faker/locale/en';
import update from 'immutability-helper';
import { useDrop } from 'react-dnd';

import Sortly, { ItemData, DragObject, add, remove, findDescendants } from '../../../src';
import DefaultItemRenderer from './DefaultItemRenderer';
import useScreenSize from '../../hooks/useScreenSize';

type Item = ItemData<{
  categoryId: number;
  name: string;
}>;

let idSeq = 0;
const generate = (numItems: number, categoryId: number): Item[] => (
  Array
    .from(Array(numItems).keys())
    .map(() => {
      idSeq += 1;
      return {
        id: idSeq,
        categoryId,
        name: faker.name.findName(),
        depth: 0,
      };
    })
);

const CATEGORIES = Array.from(Array(3).keys()).map((data, index) => ({
  id: index + 1,
  name: faker.address.country(),
  items: generate(5, index + 1),
}));

type TreeProps = {
  id: number;
  items: Item[]; 
  onChange: (items: Item[]) => void;
  onEnter: (item: DragObject) => void;
};
const Tree = ({ items, onChange, onEnter }: TreeProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ hovered, dragItem }, drop] = useDrop({
    accept: 'TREE',
    collect: (monitor) => ({
      hovered: monitor.isOver(),
      dragItem: monitor.getItem(),
    }),
  });

  const handleMove = () => {
    if (!dragItem) {
      return;
    }

    if (hovered) {
      onEnter(dragItem);
    }
  };

  React.useEffect(() => {
    if (dragItem) {
      handleMove();
    }
  }, [hovered]);

  drop(ref);

  return (
    <div ref={ref}>
      <Sortly<Item>
        type="TREE"
        items={items}
        onChange={onChange}
      >
        {DefaultItemRenderer}
      </Sortly>
    </div>
  );
};

const MultipleTree = () => {
  const { isLargeScreen } = useScreenSize();
  const [categories, setCategories] = React.useState(CATEGORIES);
  const handleChange = (index: number) => (newItems: Item[]) => {
    setCategories(update(categories, {
      [index]: { items: { $set: newItems } },
    }));
  };
  const handleEnter = (targetCategoryIndex: number) => (dragItem: DragObject) => {
    const sourceCategoryIndex = categories.findIndex((category) => (
      category.items.some((item) => item.id === dragItem.id)
    ));
    const sourceCategory = categories[sourceCategoryIndex]; 
    const targetCategory = categories[targetCategoryIndex];

    if (targetCategory.items.some((item) => item.id === dragItem.id)) {
      return;
    }

    const sourceItemIndex = sourceCategory.items.findIndex((item) => item.id === dragItem.id);
    const sourceItem = sourceCategory.items[sourceItemIndex];
    const sourceDescendants = findDescendants(sourceCategory.items, sourceItemIndex);
    const items = [sourceItem, ...sourceDescendants].map((item) => ({ ...item, categoryId: targetCategory.id }));

    setCategories(update(categories, {
      [sourceCategoryIndex]: {
        items: { $set: remove(sourceCategory.items, sourceItemIndex) },
      },
      [targetCategoryIndex]: { 
        items: { $set: add(targetCategory.items, items) } 
      },
    }));
  };

  return (
    <Flipper flipKey={categories.map(({ items }) => items.map(({ id }) => id).join('.')).join('.')}>
      <Box display={{ md: 'flex' }}>
        {categories.map(({ id, name, items }, index) => (
          <Box 
            key={id}
            width={isLargeScreen ? `${100 / categories.length}%` : undefined} 
            pr={{ md: index < categories.length - 1 ? 4 : 0 }}
            mb={4}
          >
            <Typography variant="h5" gutterBottom>{name}</Typography>
            <Tree
              id={id}
              items={items}
              onChange={handleChange(index)}
              onEnter={handleEnter(index)}
            />
          </Box>
        ))}
      </Box>
    </Flipper>
  );
};

export default MultipleTree;
