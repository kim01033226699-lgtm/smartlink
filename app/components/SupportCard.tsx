'use client';

import { Plus, LucideIcon } from "lucide-react";
import { useState } from "react";
import "./SupportCard.css";

interface SupportCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function SupportCard({ title, description, icon: Icon, onClick }: SupportCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="support-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Plus Button */}
      <div className="support-card-plus">
        <Plus className="support-card-plus-icon" strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="support-card-content">
        {/* Large Centered Icon */}
        <div className="support-card-icon-wrapper">
          <Icon className="support-card-icon" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h2 className="support-card-title">{title}</h2>
      </div>
    </div>
  );
}
