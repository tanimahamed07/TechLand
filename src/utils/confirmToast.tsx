import toast from "react-hot-toast";

export const confirmToast = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">{message}</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="flex-1 rounded-md bg-destructive px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: "#ef4444" }}
            >
              Confirm
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="flex-1 rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      },
    );
  });
};
