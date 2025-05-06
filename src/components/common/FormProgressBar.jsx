import { Progress } from "@/components/ui/Progresss";
//here is a Progress bar form
const FormProgressBar = ({ progress }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Progress
        value={progress}
        className="w-full sm:w-[60%]"
      />
      <p className="text-xs text-gray-700">{progress}%</p>
    </div>
  );
};

export default FormProgressBar;
