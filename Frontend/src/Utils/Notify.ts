import { Notyf } from "notyf"; // npm i notyf

class Notify {
    private notyf = new Notyf({
        position: { x: "right", y: "top" },
        duration: 2000,
        dismissible: true,
        ripple: false,
        types: [
            {
                type: "success",
                background: "#4f46e5"
            },
            {
                type: "error",
                background: "#ef4444"
            }
        ]
    });

    private activeError: any = null;

    public success(message: string): void {
        this.notyf.success(message);
    }

    public error(err: any): void {
        const message = this.extractErrorMessage(err);
        // dismiss previous error before showing new one:
        if (this.activeError) {
            this.notyf.dismiss(this.activeError);
        }
        this.activeError = this.notyf.error(message);
    }

    private extractErrorMessage(err: any): string {
        if (typeof err === "string") return err;
        if (typeof err?.response?.data === "string") return err.response.data;
        if (typeof err?.response?.data?.message === "string") return err.response.data.message;
        if (typeof err?.message === "string") return err.message;
        return "Some error, please try again.";
    }
}

export const notify = new Notify();
