import React from 'react';
import { Editor, Range } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import { Suggestion, SuggestionOptions } from '@tiptap/suggestion';
import { Heading1, Heading2, Heading3, List, ListOrdered, Pilcrow } from 'lucide-react';
import tippy, { Instance } from 'tippy.js';
import { CommandList } from './CommandList';

const commandItems = (editor: Editor) => [
  { title: 'Paragraph', icon: <Pilcrow size={18} />, command: () => editor.chain().focus().setParagraph().run() },
  { title: 'Heading 1', icon: <Heading1 size={18} />, command: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
  { title: 'Heading 2', icon: <Heading2 size={18} />, command: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
  { title: 'Heading 3', icon: <Heading3 size={18} />, command: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
  { title: 'Bullet List', icon: <List size={18} />, command: () => editor.chain().focus().toggleBulletList().run() },
  { title: 'Ordered List', icon: <ListOrdered size={18} />, command: () => editor.chain().focus().toggleOrderedList().run() },
];

const renderPopup = () => {
  let component: ReactRenderer | null = null;
  let popup: Instance[] | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props: {
          ...props,
          items: commandItems(props.editor).filter(item => item.title.toLowerCase().startsWith(props.query.toLowerCase())),
          command: (command: () => void) => {
            props.editor.chain().focus().deleteRange(props.range).run();
            command();
          },
        },
        editor: props.editor,
      });

      popup = tippy(document.body, {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: DOMRect; query: string }) => {
      component?.updateProps({
        ...props,
        items: commandItems(props.editor).filter(item => item.title.toLowerCase().startsWith(props.query.toLowerCase())),
        command: (command: () => void) => {
          props.editor.chain().focus().deleteRange(props.range).run();
          command();
        },
      });

      popup?.[0]?.setProps({
        getReferenceClientRect: props.clientRect,
      });
    },
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'Escape') {
        popup?.[0]?.hide();
        return true;
      }
      return (component?.ref as any)?.onKeyDown(event);
    },
    onExit: () => {
      popup?.[0]?.destroy();
      component?.destroy();
    },
  };
};

export const SlashCommand: Partial<SuggestionOptions> = {
  char: '/',
  items: ({ query }) => {
    // This is just for filtering, the actual items are created in the renderer
    return commandItems({} as Editor).filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10);
  },
  render: renderPopup,
  command: ({ editor, range, props }) => {
    props.command();
  },
};