import DOMPurify from "dompurify";

interface RichTextDisplayProps {
  content: string;
}

export const RichTextDisplay = ({ content }: RichTextDisplayProps) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};
