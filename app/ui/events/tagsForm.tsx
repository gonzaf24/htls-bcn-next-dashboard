/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState } from 'react';
import Tags from './tags';
import { tagsData } from './data';

const tagsGroups = {
  0: { id: 1, name: 'event_activity_title' },
  1: { id: 2, name: 'theme_interests_title' },
  2: { id: 3, name: 'audience_music_genres_title' },
};

export default function TagsForm({
  setSelectedTags,
  selectedTags,
}: {
  setSelectedTags: (tags: string[]) => void;
  selectedTags: string[];
}) {
  const tagsGroup1 = tagsData
    .filter(
      (tag: { text: string; group: number }) => tag.group === tagsGroups[0].id,
    )
    .map((tag: { text: string; group: number }) => ({ text: tag.text }));

  const tagsGroup2 = tagsData
    .filter(
      (tag: { text: string; group: number }) => tag.group === tagsGroups[1].id,
    )
    .map((tag: { text: string; group: number }) => ({ text: tag.text }));

  const tagsGroup3 = tagsData
    .filter(
      (tag: { text: string; group: number }) => tag.group === tagsGroups[2].id,
    )
    .map((tag: { text: string; group: number }) => ({ text: tag.text }));

  const selectedTagsCorrespondingGroup1 = selectedTags.filter((tag: string) => {
    return tagsGroup1.map((tag: { text: string }) => tag.text).includes(tag);
  });

  const selectedTagsCorrespondingGroup2 = selectedTags.filter((tag: string) => {
    return tagsGroup2.map((tag: { text: string }) => tag.text).includes(tag);
  });

  const selectedTagsCorrespondingGroup3 = selectedTags.filter((tag: string) => {
    return tagsGroup3.map((tag: { text: string }) => tag.text).includes(tag);
  });

  const [selectedTagsGroup1, setSelectedTagsGroup1] = useState<string[]>(
    selectedTagsCorrespondingGroup1,
  );
  const [selectedTagsGroup2, setSelectedTagsGroup2] = useState<string[]>(
    selectedTagsCorrespondingGroup2,
  );
  const [selectedTagsGroup3, setSelectedTagsGroup3] = useState<string[]>(
    selectedTagsCorrespondingGroup3,
  );

  useEffect(() => {
    setSelectedTags([
      ...selectedTagsGroup1,
      ...selectedTagsGroup2,
      ...selectedTagsGroup3,
    ]);
  }, [selectedTagsGroup1, selectedTagsGroup2, selectedTagsGroup3]);

  return (
    <ul className="flex w-full flex-col flex-wrap gap-4">
      <h1>Tag your event</h1>
      <Tags
        selectedTags={selectedTagsGroup1}
        setSelectedTags={setSelectedTagsGroup1}
        groupName={tagsGroups[0].name}
        items={tagsGroup1}
      />
      <Tags
        selectedTags={selectedTagsGroup2}
        setSelectedTags={setSelectedTagsGroup2}
        groupName={tagsGroups[1].name}
        items={tagsGroup2}
      />
      <Tags
        selectedTags={selectedTagsGroup3}
        setSelectedTags={setSelectedTagsGroup3}
        groupName={tagsGroups[2].name}
        items={tagsGroup3}
      />
      <div className="flex flex-col gap-4 rounded-xl border-2 border-[#3f3f3f] p-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-white-500">{'Tags seleccionados'}</h2>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag: string, index: number) => {
              return (
                <span
                  key={index}
                  className="rounded-full bg-[#3f3f3f] px-4 py-2 text-tiny text-white"
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </ul>
  );
}
