'use client';
import React from 'react';
import { Select, SelectItem, Chip } from '@nextui-org/react';

export default function Tags({
  selectedTags,
  setSelectedTags,
  groupName,
  items,
}: {
  selectedTags: string[];
  setSelectedTags: any;
  groupName: string;
  items: { text: string }[];
}) {
  const handleSelectionChange = (keys: Set<React.Key> | string) => {
    let keysArray: string[];

    if (typeof keys === 'string') {
      keysArray = [keys];
    } else if (keys instanceof Set) {
      keysArray = Array.from(keys) as string[];
    } else {
      keysArray = [];
    }

    const addedTags = keysArray.filter((key) => !selectedTags.includes(key));
    const removedTags = selectedTags.filter((tag) => !keysArray.includes(tag));

    if (addedTags.length === 0 && removedTags.length === 0) return;
    if (addedTags.length > 0) setSelectedTags([...selectedTags, ...addedTags]);
    if (removedTags.length > 0)
      setSelectedTags(selectedTags.filter((tag) => !removedTags.includes(tag)));
  };

  return (
    <Select
      items={items}
      label={groupName}
      defaultSelectedKeys={selectedTags}
      variant="bordered"
      isMultiline={true}
      selectionMode="multiple"
      placeholder={'Selecciona tags'}
      labelPlacement="outside"
      onSelectionChange={handleSelectionChange}
      classNames={{
        base: 'w-full',
        trigger: 'min-h-12 py-2',
      }}
      renderValue={(items) => {
        return (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Chip className="text-tiny" key={item.key}>
                {item.data?.text || ''}
              </Chip>
            ))}
          </div>
        );
      }}
    >
      {(element) => (
        <SelectItem key={element.text} textValue={element.text}>
          <div className="flex flex-col">
            <span className="text-tiny">{element.text}</span>
          </div>
        </SelectItem>
      )}
    </Select>
  );
}
