"use client";

import { Suspense, ReactNode } from "react";

type Props = {
children: ReactNode;
fallback?: ReactNode;
};

export default function SuspenseWrapper({
children,
fallback,
}: Props) {
return (
<Suspense
fallback={
fallback ?? ( <div className="flex items-center justify-center py-20"> <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" /> </div>
)
}
>
{children} </Suspense>
);
}
