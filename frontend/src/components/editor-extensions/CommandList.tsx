import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface CommandListProps {
  items: { title: string; icon: React.ReactNode; command: () => void }[];
  command: (command: () => void) => void;
}

export const CommandList = forwardRef((props: CommandListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item.command);
    }
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="bg-background border rounded-lg shadow-lg p-2">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            key={index}
            className={`flex items-center gap-2 w-full text-left p-2 rounded-md ${
              index === selectedIndex ? 'bg-muted' : ''
            }`}
            onClick={() => selectItem(index)}
          >
            {item.icon}
            <span>{item.title}</span>
          </button>
        ))
      ) : (
        <div className="p-2">No results</div>
      )}
    </div>
  );
});
