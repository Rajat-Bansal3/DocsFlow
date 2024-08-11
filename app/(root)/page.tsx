import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Empty from "@/public/assets/icons/doc.svg";

import Image from "next/image";
import AddDocumentButton from "@/components/AddDocumentButton";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { deleteDocument, getDocuments } from "@/lib/actions/room.actions";
import documentIcon from "@/public/assets/icons/doc.svg";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import DeleteButton from "@/components/DeleteButton";
import Notifications from "@/components/Notifications";

const Home = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  let docs = await getDocuments({
    userId: user.emailAddresses[0].emailAddress,
  });
  docs = docs.data;

  return (
    <main className='home-container'>
      <Header className='sticky left-0 top-0'>
        <div className='flex items-center gap-2 lg:gap-4'>
          <Notifications/>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      {docs.length > 0 ? (
        <div className='document-list-container'>
          <div className='document-list-title'>
            <h3 className='text-28-semibold'>all documents</h3>
            <AddDocumentButton
              userId={user.id}
              email={user.emailAddresses[0].emailAddress}
            />
          </div>
          <ul className='document-ul'>
            {docs.map((doc: any) => {
              return (
                <li key={doc.id} className='document-list-item'>
                  <Link
                    href={`/documents/${doc.id}`}
                    className='flex flex-1 items-center gap-4 cursor-pointer'
                  >
                    <div className='hidden sm:block'>
                      <Image
                        src={documentIcon}
                        width={40}
                        height={40}
                        alt='docPng'
                      />
                    </div>
                    <div className='space-y-1'>
                      <p className='line-clamp-1'>{doc.metadata.title}</p>
                      <p className='text-sm font-light text-blue-100'>
                        Created About:{dateConverter(doc.createdAt)}
                      </p>
                    </div>
                    <DeleteButton roomIdProp={doc.id} className="border p-2 rounded-lg bg-red-600" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className='document-list-empty'>
          <Image
            src={Empty}
            alt='EmptyImg'
            width={40}
            height={40}
            className='mx-auto'
          />
          <AddDocumentButton
            userId={user.id}
            email={user.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
};
export default Home;
