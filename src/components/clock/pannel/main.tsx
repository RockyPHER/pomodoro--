import "./style.css";

interface PannelProps {
  title: string;
  description: string | undefined;
}

export const Pannel = ({ title, description }: PannelProps) => {
  return (
    <div className="pannel-container">
      <div className="pannel-task">
        <div className="pannel-task-head">
          <div className="pannel-task-title text">{title}</div>
        </div>
        {description && (
          <div className="pannel-task-body">
            <div className="pannel-task-description text">{description}</div>
          </div>
        )}
      </div>
    </div>
  );
};
