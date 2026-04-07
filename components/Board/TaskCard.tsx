"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, Typography, Box } from "@mui/material";
import EditTaskModal from "@/components/EditTaskModal";

import { Task } from "@/types/task";

export default function TaskCard({
  task,
  isOverlay,
}: {
  task: Task;
  isOverlay?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        p: 1.5,
        cursor: "grab",
        bgcolor: "background.default",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: isOverlay ? 4 : "0 1px 2px rgba(0,0,0,0.1)",
        "&:hover": { borderColor: "primary.main" },
        position: "relative",
      }}
    >
      <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
        {task.title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          ID-{task.id.slice(0, 4)}
        </Typography>
        {/* Pass task to Edit Modal */}
        <EditTaskModal task={task} />
      </Box>
    </Card>
  );
}
