'use client'

import { useEffect, useMemo, useState } from 'react'

function findSelection(topics, value) {
  for (const topic of topics) {
    if (topic.id === value) return { mainId: topic.id, selected: topic, level: 'main' }
    for (const subtopic of topic.subtopics || []) {
      if (subtopic.id === value) return { mainId: topic.id, selected: subtopic, level: 'subtopic' }
      if ((subtopic.resources || []).some((resource) => resource.id === value)) {
        return { mainId: topic.id, selected: subtopic, level: 'subsection' }
      }
    }
  }
  return { mainId: '', selected: null, level: null }
}

export default function TopicPicker({ value, onChange, topics = [] }) {
  const initial = useMemo(() => findSelection(topics, value), [topics, value])
  const [mainTopicId, setMainTopicId] = useState(initial.mainId)
  const selectedMainTopic = topics.find((topic) => topic.id === mainTopicId)
  const subtopics = selectedMainTopic?.subtopics || []
  const selectedSubtopicId = initial.level === 'subtopic' || initial.level === 'subsection' ? initial.selected?.id || '' : ''

  useEffect(() => {
    if (value) setMainTopicId(initial.mainId)
    if (initial.level === 'subsection' && initial.selected) {
      onChange({
        value: initial.selected.id,
        label: initial.selected.title,
        mainTopic: topics.find((topic) => topic.id === initial.mainId)?.title || '',
      })
    }
  }, [initial.level, initial.mainId, initial.selected, onChange, topics, value])

  const chooseMainTopic = (event) => {
    const nextMainId = event.target.value
    setMainTopicId(nextMainId)
    onChange({ value: '', label: '', mainTopic: topics.find((topic) => topic.id === nextMainId)?.title || '' })
  }

  const chooseSubtopic = (event) => {
    const subtopic = subtopics.find((item) => item.id === event.target.value)
    onChange({
      value: subtopic?.id || '',
      label: subtopic?.title || '',
      mainTopic: selectedMainTopic?.title || '',
    })
  }

  const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-midnight-navy/40 focus:ring-2 focus:ring-midnight-navy/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

  return (
    <div className="mt-2 space-y-4">
      <label className="block text-[11px] font-medium text-slate-500">
        Main topic
        <div className="relative">
          <select value={mainTopicId} onChange={chooseMainTopic} className={`${fieldClass} appearance-none pr-10`}>
            <option value="">Select a main topic</option>
            {topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}
          </select>
          <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-[18px] text-slate-400">expand_more</span>
        </div>
      </label>

      <label className="block text-[11px] font-medium text-slate-500">
        Subtopic
        <div className="relative">
          <select
            required
            value={selectedSubtopicId}
            onChange={chooseSubtopic}
            disabled={!mainTopicId}
            className={`${fieldClass} appearance-none pr-10`}
          >
            <option value="">{mainTopicId ? 'Select a subtopic' : 'Select a main topic first'}</option>
            {subtopics.map((subtopic) => <option key={subtopic.id} value={subtopic.id}>{subtopic.title}</option>)}
          </select>
          <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-[18px] text-slate-400">expand_more</span>
        </div>
      </label>

      {selectedMainTopic && (
        <p className="rounded-xl bg-midnight-navy/5 px-3 py-2 text-[10px] leading-4 text-slate-500">
          <span className="font-semibold text-midnight-navy">{selectedMainTopic.title}</span>
          {initial.selected && selectedSubtopicId ? ` / ${initial.selected.title}` : ' / Choose a subtopic'}
        </p>
      )}
    </div>
  )
}
