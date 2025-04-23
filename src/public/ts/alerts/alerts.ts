declare global {
  interface Window {
    Swal: { fire: (opts: any) => Promise<void> };
  }
}

export const registerAlert = (text: string) => {
  window.Swal.fire({
    title: "Registration Completed!",
    icon: "success",
    text,
    confirmButtonText: "OK",
  }).then(() => (location.href = "/login"));
};

export const errorAlert = (text: string) => {
  window.Swal.fire({
    title: "Error!",
    icon: "error",
    text,
    confirmButtonText: "OK",
  });
};
