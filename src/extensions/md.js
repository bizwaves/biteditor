import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import MarkdownIt from 'markdown-it';
import { generateJSON } from '@tiptap/html';

export const EventHandler = Extension.create({
  name: 'eventHandler',

  addProseMirrorPlugins() {
    const { editor } = this;
    return [
      ...(this.parent?.() || []),
      new Plugin({
        key: new PluginKey('eventHandler'),
        props: {
          handlePaste(view, event) {
            if (!event.clipboardData) {
              return false;
            }

            const md = new MarkdownIt();

            const mdContents = event.clipboardData.getData('text/plain');
            editor.commands.insertContent(
              generateJSON(md.render(mdContents), editor.allExt),
              {
                parseOptions: {
                  preserveWhitespace: false,
                },
              }
            );

            return true;
          },
        },
      }),
    ];
  },
});
