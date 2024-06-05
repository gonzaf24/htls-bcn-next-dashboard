/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState } from 'react';
import Tags from './tags';

const tagsGroups = {
  0: { id: 1, name: 'event_activity_title' },
  1: { id: 2, name: 'theme_interests_title' },
  2: { id: 3, name: 'audience_music_genres_title' },
};

export default function TagsForm({
  setSelectedTags,
  tags,
}: {
  setSelectedTags: (tags: string[]) => void;
  tags?: string[];
}) {
  const [selectedTagsGroup1, setSelectedTagsGroup1] = useState<string[]>([]);
  const [selectedTagsGroup2, setSelectedTagsGroup2] = useState<string[]>([]);
  const [selectedTagsGroup3, setSelectedTagsGroup3] = useState<string[]>([]);

  let selectedTags = [
    ...selectedTagsGroup1,
    ...selectedTagsGroup2,
    ...selectedTagsGroup3,
  ].filter((tag) => tag.trim() !== '');

  useEffect(() => {
    if (tags) {
      const filteredTags = tags.filter((tag) => tag.trim() !== '');
      setSelectedTags(filteredTags);
    }
  }, [tags]);

  console.log('mmmm', selectedTagsGroup1);

  useEffect(() => {
    const filteredTags = selectedTags.filter((tag) => tag.trim() !== '');
    setSelectedTags(filteredTags);
  }, [selectedTagsGroup1, selectedTagsGroup2, selectedTagsGroup3]);

  return (
    <ul className="mx-auto mt-6 flex flex-col flex-wrap gap-4">
      Tag your event
      <Tags
        tags={tags}
        groupId={tagsGroups[0].id}
        groupName={tagsGroups[0].name}
        setSelectedTags={setSelectedTagsGroup1}
      />
      <Tags
        tags={tags}
        groupId={tagsGroups[1].id}
        groupName={tagsGroups[1].name}
        setSelectedTags={setSelectedTagsGroup2}
      />
      <Tags
        tags={tags}
        groupId={tagsGroups[2].id}
        groupName={tagsGroups[2].name}
        setSelectedTags={setSelectedTagsGroup3}
      />
      <div className="flex flex-col gap-4 rounded-xl border-2 border-[#3f3f3f] p-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-white-500">{'Tags seleccionados'}</h2>
          <div className="flex flex-wrap gap-2">
            {[...selectedTags].map((tag: string) => {
              return (
                <span
                  key={tag}
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
