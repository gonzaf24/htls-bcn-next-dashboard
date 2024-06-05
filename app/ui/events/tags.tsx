'use client';
import React from 'react';
import { Select, SelectItem, Chip } from '@nextui-org/react';
import { tagsData } from './data.js';

export default function Tags({
  tags,
  groupId,
  setSelectedTags,
  groupName,
}: {
  tags?: string[];
  groupId?: number;
  setSelectedTags: any;
  groupName?: string;
}) {
  const filteredTags =
    groupId !== undefined
      ? tagsData.filter((tag) => tag.group === groupId)
      : tagsData;
  const tagsGroupName = groupName ? groupName : '';

  return (
    <Select
      items={filteredTags}
      label={tagsGroupName}
      defaultSelectedKeys={tags}
      variant="bordered"
      isMultiline={true}
      selectionMode="multiple"
      placeholder={'Selecciona tags'}
      labelPlacement="outside"
      onSelectionChange={(items) => {
        setSelectedTags(items);
      }}
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
